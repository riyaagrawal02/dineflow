import express from "express";
import Order from "../models/Order.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", requireAuth, requireAdmin, async (_req, res, next) => {
    try {
        const orders = await Order.find({}).select("total_amount order_status");
        const total = orders.length;
        const revenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const pending = orders.filter((o) => o.order_status === "placed" || o.order_status === "preparing").length;
        const completed = orders.filter((o) => o.order_status === "served").length;
        return res.json({ total, revenue, pending, completed });
    } catch (err) {
        return next(err);
    }
});

router.get("/orders", requireAuth, requireAdmin, async (_req, res, next) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .select("order_number customer_name table_number total_amount order_status payment_status createdAt");
        const payload = orders.map((order) => ({
            id: order._id.toString(),
            order_number: order.order_number,
            customer_name: order.customer_name,
            table_number: order.table_number,
            total_amount: order.total_amount,
            order_status: order.order_status,
            payment_status: order.payment_status,
            createdAt: order.createdAt,
        }));
        return res.json({ orders: payload });
    } catch (err) {
        return next(err);
    }
});

router.patch("/orders/:id", requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const { status } = req.body || {};
        if (!status) return next({ status: 400, message: "status is required" });
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { order_status: status },
            { new: true }
        ).select("order_status");
        if (!order) return next({ status: 404, message: "Order not found" });
        return res.json({ order });
    } catch (err) {
        return next(err);
    }
});

export default router;
