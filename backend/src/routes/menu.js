import express from "express";
import MenuItem from "../models/MenuItem.js";
import { mockMenuItems } from "../data/mockMenu.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const { available } = req.query;
        const filter = {};
        if (available === "true") filter.is_available = true;
        const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
        if (!items.length) {
            const fallback = mockMenuItems
                .filter((item) => (available === "true" ? item.is_available : true))
                .map((item, index) => ({
                    id: `mock-${index + 1}`,
                    ...item,
                }));
            return res.json({ items: fallback });
        }
        const payload = items.map((item) => ({
            id: item._id.toString(),
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            is_veg: item.is_veg,
            is_popular: item.is_popular,
            is_available: item.is_available,
        }));
        return res.json({ items: payload });
    } catch (err) {
        return next(err);
    }
});

router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const payload = req.body || {};
        const item = await MenuItem.create(payload);
        return res.status(201).json({ item });
    } catch (err) {
        return next(err);
    }
});

router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body || {}, { new: true });
        if (!item) return next({ status: 404, message: "Menu item not found" });
        return res.json({ item });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deleted) return next({ status: 404, message: "Menu item not found" });
        return res.json({ ok: true });
    } catch (err) {
        return next(err);
    }
});

export default router;
