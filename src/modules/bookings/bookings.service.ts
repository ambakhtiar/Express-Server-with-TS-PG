import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createBooking = async (payload: {
    vehicle_id: number; rent_start_date: string; rent_end_date: string; status?: string;
}, customer_id: number) => {
    let { vehicle_id, rent_start_date, rent_end_date, status } = payload;

    if (!vehicle_id || !rent_start_date || !rent_end_date) {
        throw new Error("Missing required booking fields");
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
    }
    if (end <= start) {
        throw new Error("rent_end_date must be after rent_start_date");
    }

    // ✅ Calculate rental duration. time to convert milisecond
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const durationDays = Math.ceil((end.getTime() - start.getTime()) / MS_PER_DAY);
    if (durationDays <= 0) {
        throw new Error("Invalid rental duration");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const vehicleRes = await client.query(
            `SELECT id, daily_rent_price, availability_status
       FROM vehicles WHERE id = $1 FOR UPDATE`, // FOR UPDATE: Lock in multiple people search
            [vehicle_id]
        );

        if (vehicleRes.rowCount === 0) {
            throw new Error("Vehicle not found");
        }

        const vehicle = vehicleRes.rows[0];

        if (vehicle.availability_status !== "available") {
            throw new Error("Vehicle is not available");
        }

        const dailyPrice = Number(vehicle.daily_rent_price);
        if (Number.isNaN(dailyPrice) || dailyPrice <= 0) {
            throw new Error("Invalid vehicle daily_rent_price");
        }

        const total_price = Number((dailyPrice * durationDays).toFixed(2));

        const insertRes = await client.query(
            `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                customer_id, vehicle_id,
                start.toISOString().split("T")[0],
                end.toISOString().split("T")[0],
                total_price,
                status ?? "active",
            ]
        );

        await client.query(
            `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
            ["booked", vehicle_id]
        );

        await client.query("COMMIT");
        return insertRes.rows[0];
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    }
};

const getBookings = async (user: JwtPayload) => {
    await autoUpdateBookings();
    let result;
    if (user.role === 'admin') {
        result = await pool.query(`SELECT * FROM bookings`);
    } else {
        result = await pool.query(
            `SELECT * FROM bookings WHERE customer_id = $1`,
            [user.id]
        );
    }
    console.log(user.id, result.rows);
    return result.rows;
};

const cancelBooking = async (bookingId: string, user: JwtPayload) => {
    // Fetch booking
    let bookingResult;
    if (user.role === "admin") {
        bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1`,
            [bookingId]
        );
    } else {
        bookingResult = await pool.query(
            `SELECT * FROM bookings WHERE id = $1 AND customer_id = $2`,
            [bookingId, user.id]
        );
    }
    const booking = bookingResult.rows[0];

    if (!booking) {
        throw new Error("Booking not found or not owned by customer");
    }

    if (booking.status === "cancelled") {
        throw new Error("Booking already cenceled !")
    }

    const today = new Date();
    const rentStart = new Date(booking.rent_start_date);

    if (today >= rentStart) {
        throw new Error("Cannot cancel after rental start date");
    }

    await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
        [bookingId]
    );

    await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
    );

    return { message: "Booking cancelled and vehicle set to available" };
};

const autoUpdateBookings = async () => {
    const bookingsResult = await pool.query(`SELECT * FROM bookings`);
    const bookings = bookingsResult.rows;

    const today = new Date();

    for (const booking of bookings) {
        const rentEnd = new Date(booking.rent_end_date);

        if (today >= rentEnd && booking.status !== "returned") {
            // Update booking status
            await pool.query(
                `UPDATE bookings SET status = 'returned' WHERE id = $1`,
                [booking.id]
            );

            // Immediately update vehicle status
            await pool.query(
                `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
                [booking.vehicle_id]
            );
        }
    }

    return { message: "Auto update executed" };
};

const deleteBooking = async (id: string) => {
    const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [id]);
    return result.rows[0];
};

export const bookingServices = {
    createBooking,
    getBookings,
    cancelBooking,
    autoUpdateBookings,
    deleteBooking,
};
