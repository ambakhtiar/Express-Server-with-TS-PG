import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "You are not allowed to access this resource",
                });
            }

            const token = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;

            const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource",
                });
            }

            next();
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "jwt expired" });
            }
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({ success: false, message: "Invalid token" });
            }
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
};

export default auth;