import { Request, Response } from "express";
import { bookingServices } from "./bookings.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);
        // console.log(result.rows[0]);
        res.status(201).json({
            success: false,
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

const getBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getBookings();

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
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

const getSingleBooking = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await bookingServices.getSingleBooking(req.params.id as string);

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

const updateBooking = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;
    try {
        const result = await bookingServices.updateBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, req.params.id!);
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

const deleteBooking = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await bookingServices.deleteBooking(req.params.id!);

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

export const bookingControllers = {
    createBooking,
    getBooking,
    getSingleBooking,
    updateBooking,
    deleteBooking,
};
