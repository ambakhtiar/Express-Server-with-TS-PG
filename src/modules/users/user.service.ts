import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUser = async (payload: Record<string, unknown>) => {
    let { name, role, email, password, phone } = payload;
    email = email?.toString().toLowerCase();
    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email, password, phone, role) 
        VALUES($1, $2, $3, $4, COALESCE($5, 'customer'))
        RETURNING *`,
        [name, email, hashedPass, phone, role]
    );

    return result;
};

const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

const getSingleuser = async (id: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    return result;
};

const updateUser = async (payload: { name?: string; password?: string; phone?: string; role?: string; id: string }) => {
    const { name, password, phone, role, id } = payload;
    let hashedPass: string | null = null;
    if (password) {
        hashedPass = await bcrypt.hash(password as string, 10);
    }

    const result = await pool.query(
        `UPDATE users SET name=COALESCE($1, name), password=COALESCE($2, password), phone=COALESCE($3, phone), role=COALESCE($4, role) WHERE id=$5 RETURNING *`,
        [name ?? null, hashedPass, phone ?? null, role ?? null, id]
    );

    return result;
};

const deleteUser = async (id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    return result;
};

export const userServices = {
    createUser,
    getUser,
    getSingleuser,
    updateUser,
    deleteUser,
};
