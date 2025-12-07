import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
    connectionString: `${config.connection_str}`,
    ssl: { rejectUnauthorized: false }
})


const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(200) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            role VARCHAR(20) DEFAULT 'customer'
        )
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(30) NOT NULL,
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price FLOAT NOT NULL,
            availability_status VARCHAR(20) NOT NULL
        )
        `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            customer_id INT REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price FLOAT NOT NULL,
            status VARCHAR(20) NOT NULL
        )
        `)
}

export default initDB;
