import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.createVehicle(req.body);
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

const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.getVehicles();

        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const getSingleVehicle = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await vehiclesServices.getSingleVehicle(req.params.id as string);

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

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesServices.updateVehicle(req.body, req.params.id!);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
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

const deleteVehicle = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await vehiclesServices.deleteVehicle(req.params.id!);

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

export const vehiclesControllers = {
    createVehicle,
    getVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
};
