import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createBooking = async (payload: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("Missing required booking fields");
    }

    const start = new Date(rent_start_date as string);
    const end = new Date(rent_end_date as string);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
    }
    if (end <= start) {
        throw new Error("rent_end_date must be after rent_start_date");
    }

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
    if (durationDays <= 0) throw new Error("Invalid rental duration");

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const vehicleRes = await client.query(
            `SELECT id, daily_rent_price, availability_status
             FROM vehicles WHERE id = $1 FOR UPDATE`,
            [vehicle_id]
        );

        if (vehicleRes.rowCount === 0) {
            await client.query("ROLLBACK");
            throw new Error("Vehicle not found");
        }

        const vehicle = vehicleRes.rows[0];
        if (vehicle.availability_status !== "available") {
            await client.query("ROLLBACK");
            throw new Error("Vehicle is not available");
        }

        const dailyPrice = Number(vehicle.daily_rent_price);
        if (Number.isNaN(dailyPrice) || dailyPrice <= 0) {
            await client.query("ROLLBACK");
            throw new Error("Invalid vehicle daily_rent_price");
        }

        const total_price = Number((dailyPrice * durationDays).toFixed(2));

        const insertRes = await client.query(
            `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
             VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [customer_id, vehicle_id, start.toISOString(), end.toISOString(), total_price, status ?? "booked"]
        );

        await client.query(
            `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
            ["booked", vehicle_id]
        );

        await client.query("COMMIT");
        return insertRes;
    } catch (err) {
        try { await client.query("ROLLBACK"); } catch (_) { }
        throw err;
    } finally {
        client.release();
    }
};

const getBookings = async () => {
    const result = await pool.query(`SELECT * FROM bookings`);
    return result;
};

const getSingleBooking = async (id: string) => {
    const result = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);

    return result;
};

const updateBooking = async (customer_id: string, vehicle_id: string, rent_start_date: string, rent_end_date: string, total_price: number, status: string, id: string) => {
    const result = await pool.query(
        `UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, id]
    );

    return result;
};

const deleteBooking = async (id: string) => {
    const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);

    return result;
};

export const bookingServices = {
    createBooking,
    getBookings,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
