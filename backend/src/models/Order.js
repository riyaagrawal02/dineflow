import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        order_number: { type: String, required: true, unique: true, index: true },
        customer_name: { type: String, required: true },
        phone: { type: String, required: true },
        table_number: { type: Number, required: true },
        total_amount: { type: Number, required: true },
        payment_status: { type: String, default: "paid" },
        order_status: { type: String, default: "placed" },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
        items: { type: [orderItemSchema], default: [] },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
