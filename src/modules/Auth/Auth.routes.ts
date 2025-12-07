import express from "express";
import { authControllers } from "./Auth.controller";

const router = express.Router();

router.post("/signup", authControllers.signUpUser);
router.post("/signin", authControllers.signInUser);

export const authRoutes = router;