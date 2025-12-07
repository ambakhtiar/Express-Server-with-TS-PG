import express from "express";
import { bookingControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin"), bookingControllers.getBooking);
router.get("/:id", auth("admin", "customer"), bookingControllers.getSingleBooking);
router.put("/:id", auth("admin", "customer"), bookingControllers.updateBooking);
router.delete("/:id", auth("admin"), bookingControllers.deleteBooking);

export const bookingRoutes = router;