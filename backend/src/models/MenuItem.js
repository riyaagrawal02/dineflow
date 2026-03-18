import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        image: { type: String, default: "" },
        is_veg: { type: Boolean, default: true },
        is_popular: { type: Boolean, default: false },
        is_available: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);
