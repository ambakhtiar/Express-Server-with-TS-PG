import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRoutes } from "./modules/users/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/bookings.routes";
import { authRoutes } from "./modules/Auth/Auth.routes";

const app = express();

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initializing DB
initDB();

// "/" -> localhost:5000/
app.get("/", (req: Request, res: Response) => {
    res.send("Server Running...!");
});

//CRUD
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/auth", authRoutes);




app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});

export default app;
