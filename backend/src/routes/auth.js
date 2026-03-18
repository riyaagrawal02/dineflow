import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { createToken, serializeUser } from "../utils/auth.js";
import { requireAuth } from "../middleware/auth.js";
import { sendEmail } from "../utils/email.js";

const router = express.Router();

const buildVerifyUrl = (token) => {
    const baseUrl = process.env.APP_BASE_URL || process.env.CLIENT_ORIGIN || "http://localhost:5173";
    return `${baseUrl.replace(/\/+$/, "")}/verify-email?token=${token}`;
};

const createEmailToken = () => {
    const raw = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(raw).digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    return { raw, hash, expires };
};

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, displayName } = req.body || {};
        if (!email || !password) {
            return next({ status: 400, message: "Email and password are required" });
        }
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return next({ status: 409, message: "Email already exists" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const { raw, hash, expires } = createEmailToken();
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            displayName,
            emailVerified: false,
            emailVerificationTokenHash: hash,
            emailVerificationExpires: expires,
        });

        const verifyUrl = buildVerifyUrl(raw);
        await sendEmail({
            to: user.email,
            subject: "Verify your email",
            text: `Verify your email by opening this link: ${verifyUrl}`,
            html: `<p>Verify your email by clicking this link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        });

        return res.json({ ok: true });
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
        if (!user.emailVerified) return next({ status: 403, message: "Email not verified" });
        const token = createToken(user);
        return res.json({ token, user: serializeUser(user) });
    } catch (err) {
        return next(err);
    }
});

router.post("/verify-email", async (req, res, next) => {
    try {
        const { token } = req.body || {};
        if (!token) return next({ status: 400, message: "Verification token is required" });
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            emailVerificationTokenHash: tokenHash,
            emailVerificationExpires: { $gt: new Date() },
        });
        if (!user) return next({ status: 400, message: "Invalid or expired token" });
        user.emailVerified = true;
        user.emailVerificationTokenHash = null;
        user.emailVerificationExpires = null;
        await user.save();
        return res.json({ ok: true });
    } catch (err) {
        return next(err);
    }
});

router.post("/resend-verification", async (req, res, next) => {
    try {
        const { email } = req.body || {};
        if (!email) return next({ status: 400, message: "Email is required" });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || user.emailVerified) return res.json({ ok: true });

        const { raw, hash, expires } = createEmailToken();
        user.emailVerificationTokenHash = hash;
        user.emailVerificationExpires = expires;
        await user.save();

        const verifyUrl = buildVerifyUrl(raw);
        await sendEmail({
            to: user.email,
            subject: "Verify your email",
            text: `Verify your email by opening this link: ${verifyUrl}`,
            html: `<p>Verify your email by clicking this link:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        });

        return res.json({ ok: true });
    } catch (err) {
        return next(err);
    }
});

router.get("/me", requireAuth, (req, res) => {
    return res.json({ user: serializeUser(req.user) });
});

export default router;
