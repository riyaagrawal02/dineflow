import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, index: true },
        passwordHash: { type: String, required: true },
        displayName: { type: String },
        emailVerified: { type: Boolean, default: false },
        emailVerificationTokenHash: { type: String, default: null },
        emailVerificationExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
