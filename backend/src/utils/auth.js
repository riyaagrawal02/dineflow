import jwt from "jsonwebtoken";

export const createToken = (user) => {
    const payload = { sub: user._id.toString(), email: user.email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const serializeUser = (user) => ({
    id: user._id.toString(),
    email: user.email,
    displayName: user.displayName || "",
    emailVerified: Boolean(user.emailVerified),
    createdAt: user.createdAt,
});
