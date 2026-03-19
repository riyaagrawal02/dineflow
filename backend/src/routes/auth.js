import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createToken, serializeUser } from "../utils/auth.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, displayName } = req.body || {};
        if (!email || !password) {
            return next({ status: 400, message: "Email and password are required" });
        }
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.json({ ok: true, status: "existing" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            displayName,
            emailVerified: true,
            emailVerificationTokenHash: null,
            emailVerificationExpires: null,
        });
        return res.json({ ok: true, status: "created" });
    } catch (err) {
        return next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return next({ status: 400, message: "Email and password are required" });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return next({ status: 401, message: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return next({ status: 401, message: "Invalid credentials" });
        const token = createToken(user);
        return res.json({ token, user: serializeUser(user) });
    } catch (err) {
        return next(err);
    }
});

router.get("/me", optionalAuth, (req, res) => {
    if (!req.user) return res.json({ user: null });
    return res.json({ user: serializeUser(req.user) });
});

export default router;
