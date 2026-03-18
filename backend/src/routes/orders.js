import express from "express";
import Order from "../models/Order.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = express.Router();

const generateOrderNumber = () => `ORD-${Date.now().toString(36).toUpperCase()}`;

router.post("/", optionalAuth, async (req, res, next) => {
    try {
        const { customerName, phone, tableNumber, totalAmount, items, paymentStatus, orderStatus } = req.body || {};
        if (!customerName || !phone || !tableNumber || !totalAmount) {
            return next({ status: 400, message: "Missing required order fields" });
        }
        const order = await Order.create({
            order_number: generateOrderNumber(),
            customer_name: customerName,
            phone,
            table_number: Number(tableNumber),
            total_amount: Number(totalAmount),
            payment_status: paymentStatus || "paid",
            order_status: orderStatus || "placed",
            user_id: req.user?._id || null,
            items: Array.isArray(items) ? items.map((i) => ({
                menu_item_id: i.menuItemId || i.menu_item_id,
                quantity: Number(i.quantity || 1),
                price: Number(i.price || 0),
            })) : [],
        });
        return res.status(201).json({ orderNumber: order.order_number });
    } catch (err) {
        return next(err);
    }
});

router.get("/me", requireAuth, async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = { user_id: req.user._id };
        if (status === "active") {
            filter.order_status = { $ne: "served" };
        }
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .select("order_number table_number total_amount order_status createdAt");
        const payload = orders.map((order) => ({
            id: order._id.toString(),
            order_number: order.order_number,
            table_number: order.table_number,
            total_amount: order.total_amount,
            order_status: order.order_status,
            createdAt: order.createdAt,
        }));
        return res.json({ orders: payload });
    } catch (err) {
        return next(err);
    }
});

router.get("/by-number/:orderNumber", async (req, res, next) => {
    try {
        const order = await Order.findOne({ order_number: req.params.orderNumber })
            .select("order_number table_number order_status total_amount");
        if (!order) return next({ status: 404, message: "Order not found" });
        return res.json({
            order: {
                order_number: order.order_number,
                table_number: order.table_number,
                order_status: order.order_status,
                total_amount: order.total_amount,
            },
        });
    } catch (err) {
        return next(err);
    }
});

export default router;
