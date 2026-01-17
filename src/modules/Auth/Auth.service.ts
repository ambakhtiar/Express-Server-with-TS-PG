import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signInUser = async (email: string, password: string) => {
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1`, [email]);
    console.log(result);

    if (result.rows.length === 0) {
        return {
            status: 404,
            message: "User not found"
        };
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    // console.log(user, match);

    if (!match) {
        return {
            status: 401,
            message: "Invalid password"
        };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret as string,
        { expiresIn: '7d' }
    )
    console.log({ token });
    return {
        status: 200,
        message: "Login successful",
        data: {
            user,
            token
        }
    }
}


export const authServices = {
    signInUser,
};
