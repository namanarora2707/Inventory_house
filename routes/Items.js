const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// ➕ Insert or update item
router.post("/add", async (req, res) => {
  try {
    const { brand, type, modelNo, size, mrp, color, quantity } = req.body;

    let item = await Item.findOne({ brand, type, modelNo, size, mrp, color });

    if (item) {
      item.quantity += quantity;
      await item.save();
      return res.json({ message: "Quantity updated successfully!" });
    }

    item = new Item({ brand, type, modelNo, size, mrp, color, quantity });
    await item.save();
    res.json({ message: "Item added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding item" });
  }
});

// ➖ Remove quantity
router.post("/remove", async (req, res) => {
  try {
    const { modelNo, size, mrp, color, quantity } = req.body;

    if (!modelNo || !size || !mrp || !color || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let item = await Item.findOne({ modelNo, size, mrp, color });
    if (!item) {
      return res.status(404).json({ error: "Model not found!" });
    }
    if (item.quantity < quantity) {
      return res.status(400).json({ error: "Error: Quantity cannot go below zero!" });
    }

    item.quantity -= quantity;

    if (item.quantity === 0) {
      await item.deleteOne();
      return res.json({ message: "Item completely removed!" });
    }

    await item.save();
    res.json({ message: "Quantity reduced successfully!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 📋 Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Edit item
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Delete item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
