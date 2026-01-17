import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("Please sign in !")
        }
        const result = await bookingServices.createBooking(req.body, user.id);
        res.status(201).json({
            success: true,
            message: "Data Insert Successfully",
            data: result,
        });
    } catch (err: any) {
        console.log(err);
        res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};

const getBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("Unauthorized access !")
        }
        const result = await bookingServices.getBookings(user);

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
};

const cencelBooking = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { bookingId } = req.params;
        if (!user) {
            throw new Error("Unauthorized access !")
        }

        const result = await bookingServices.cancelBooking(bookingId as string, user);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (err: any) {
        const statusCode =
            err.message.includes("Unauthorized") ? 401 :
                err.message.includes("not found") ? 404 :
                    err.message.includes("Cannot cancel") ? 400 :
                        500;

        res.status(statusCode).json({
            success: false,
            message: err.message,
            details: err,
        });
    }
};

const deleteBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.deleteBooking(req.params.id!);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: true,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result,
            });
        }
    } catch (err: any) {
        res.status(401).json({
            success: false,
            message: err.message,
        });
    }
};

export const bookingControllers = {
    createBooking,
    getBooking,
    deleteBooking,
    cencelBooking
};
