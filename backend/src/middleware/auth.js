import jwt from "jsonwebtoken";
import User from "../models/User.js";

const parseToken = (req) => {
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ");
    return token || null;
};

export const requireAuth = async (req, _res, next) => {
    try {
        const token = parseToken(req);
        if (!token) return next({ status: 401, message: "Unauthorized" });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (!user) return next({ status: 401, message: "Unauthorized" });
        req.user = user;
        return next();
    } catch (err) {
        return next({ status: 401, message: "Unauthorized" });
    }
};

export const optionalAuth = async (req, _res, next) => {
    try {
        const token = parseToken(req);
        if (!token) return next();
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.sub);
        if (user) req.user = user;
        return next();
    } catch (_err) {
        return next();
    }
};

export const requireAdmin = (req, _res, next) => {
    const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
    const userEmail = (req.user?.email || "").toLowerCase();
    if (!adminEmail || userEmail !== adminEmail) {
        return next({ status: 403, message: "Forbidden" });
    }
    return next();
};
