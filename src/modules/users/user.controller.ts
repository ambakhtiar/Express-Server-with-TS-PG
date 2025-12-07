import { Request, Response } from "express";
import { userServices } from "./user.service";
import { authServices } from "../Auth/Auth.service";

const createUser = async (req: Request, res: Response) => {
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

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await userServices.getSingleuser(req.params.id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { name, password, phone, role } = req.body;

    try {
        // requester info should be attached by auth middleware (req.user)
        const requester = (req as any).user;
        if (!requester) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // accept either :userId or :id
        const targetId = req.params.userId ?? req.params.id;
        if (!targetId) {
            return res.status(400).json({ success: false, message: "Missing user id in params" });
        }

        // Authorization: admin can update anyone; non-admin can update only their own profile
        if (requester.role !== "admin" && requester.id !== targetId) {
            return res.status(403).json({ success: false, message: "Forbidden: cannot update other users" });
        }

        // Prevent non-admin users from changing role
        const roleToUse = requester.role === "admin" ? role : undefined;

        // Validate password if provided
        if (password && typeof password === "string" && password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const result = await userServices.updateUser(name, password, phone, role, req.params.id!);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await userServices.deleteUser(req.params.id!);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result.rows,
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const userControllers = {
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
