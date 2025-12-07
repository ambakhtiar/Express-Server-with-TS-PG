import express from "express";
import { vehiclesControllers } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin"), vehiclesControllers.createVehicle);
router.get("/", vehiclesControllers.getVehicle);
router.get("/:id", vehiclesControllers.getSingleVehicle);
router.put("/:id", auth("admin"), vehiclesControllers.updateVehicle);
router.delete("/:id", auth("admin"), vehiclesControllers.deleteVehicle);

export const vehicleRoutes = router;