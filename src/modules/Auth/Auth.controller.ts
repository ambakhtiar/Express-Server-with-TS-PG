import { Request, Response } from "express";
import { userServices } from "../users/user.service";
import { authServices } from "./Auth.service";

const signUpUser = async (req: Request, res: Response) => {
    try {
        if (req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        const result = await userServices.createUser(req.body);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: true,
            message: "Data Instered Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


const signInUser = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        const result = await authServices.signInUser(email, password);
        // console.log(result.rows[0]);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const authControllers = {
    signUpUser,
    signInUser,
};