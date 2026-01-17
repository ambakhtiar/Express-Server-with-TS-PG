import { pool } from "../../config/db";
import { bookingServices } from "../bookings/bookings.service";

const createVehicle = async (payload: Record<string, unknown>) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    return result;
};

const getVehicles = async () => {
    await bookingServices.autoUpdateBookings();

    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

    return result;
};

const updateVehicle = async (payload: { vehicle_name: string, daily_rent_price: number, availability_status: boolean }, id: string) => {
    const { vehicle_name, daily_rent_price, availability_status } = payload;

    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name=COALESCE($1, vehicle_name), daily_rent_price=COALESCE($2, daily_rent_price), availability_status=COALESCE($3, availability_status) WHERE id=$4 RETURNING *`,
        [vehicle_name ?? null, daily_rent_price ?? null, availability_status ?? null, id]
    );

    return result;
};

const deleteVehicle = async (id: string) => {
    const bookingData = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [id]
    );

    if (bookingData.rowCount && bookingData.rowCount > 0) {
        throw new Error("Cannot delete vehicle with active bookings");
    }

    const result = await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
        throw new Error("Vehicle not found");
    }

    return result;
};

export const vehiclesServices = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
