import express from "express";
import { bookingControllers } from "./bookings.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingControllers.createBooking);
router.get("/", auth("admin", "customer"), bookingControllers.getBooking);
router.put("/:bookingId", auth("admin", "customer"), bookingControllers.cencelBooking);


router.delete("/:id", auth("admin"), bookingControllers.deleteBooking);

export const bookingRoutes = router;
