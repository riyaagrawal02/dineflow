import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/razorpay-order", async (req, res, next) => {
    try {
        const { amount, currency = "INR", receipt, notes } = req.body || {};
        if (!amount || amount <= 0) {
            return next({ status: 400, message: "Invalid amount" });
        }
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keyId || !keySecret) {
            return next({ status: 500, message: "Razorpay not configured" });
        }
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const response = await axios.post(
            "https://api.razorpay.com/v1/orders",
            {
                amount: Math.round(amount * 100),
                currency,
                receipt: receipt || `rcpt_${Date.now()}`,
                notes: notes || {},
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
            }
        );
        return res.json({
            order_id: response.data.id,
            amount: response.data.amount,
            currency: response.data.currency,
            key_id: keyId,
        });
    } catch (err) {
        if (err.response) {
            return next({ status: err.response.status || 500, message: err.response.data?.error || "Razorpay error" });
        }
        return next(err);
    }
});

export default router;
