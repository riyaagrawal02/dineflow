import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
        menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    },
    { timestamps: true }
);

favoriteSchema.index({ user_id: 1, menu_item_id: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
