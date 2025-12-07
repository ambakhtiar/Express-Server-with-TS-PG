import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();


router.get("/", auth("admin"), userControllers.getUser);
router.get("/:id", userControllers.getSingleUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", auth("admin"), userControllers.deleteUser);


export const userRoutes = router;