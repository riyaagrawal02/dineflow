import express from "express";
import Favorite from "../models/Favorite.js";
import MenuItem from "../models/MenuItem.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ user_id: req.user._id })
            .populate("menu_item_id", "name price image is_veg")
            .sort({ createdAt: -1 });
        const payload = favorites.map((fav) => ({
            id: fav._id.toString(),
            menuItem: fav.menu_item_id
                ? {
                    id: fav.menu_item_id._id.toString(),
                    name: fav.menu_item_id.name,
                    price: fav.menu_item_id.price,
                    image: fav.menu_item_id.image,
                    is_veg: fav.menu_item_id.is_veg,
                }
                : null,
        }));
        return res.json({ favorites: payload });
    } catch (err) {
        return next(err);
    }
});

router.post("/toggle", requireAuth, async (req, res, next) => {
    try {
        const { menuItemId } = req.body || {};
        if (!menuItemId) return next({ status: 400, message: "menuItemId is required" });
        const existing = await Favorite.findOne({ user_id: req.user._id, menu_item_id: menuItemId });
        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            return res.json({ status: "removed" });
        }
        const itemExists = await MenuItem.findById(menuItemId);
        if (!itemExists) return next({ status: 404, message: "Menu item not found" });
        await Favorite.create({ user_id: req.user._id, menu_item_id: menuItemId });
        return res.json({ status: "added" });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
    try {
        await Favorite.deleteOne({ _id: req.params.id, user_id: req.user._id });
        return res.json({ ok: true });
    } catch (err) {
        return next(err);
    }
});

export default router;
