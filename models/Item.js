const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  brand: String,
  type: String,
  modelNo: String,
  size: String,
  mrp: Number,
  color: String,
  quantity: Number,
});

// ❌ Remove unique index
// ✅ Drop all indexes to avoid duplicate key errors
itemSchema.index({}, { unique: false });

module.exports = mongoose.model("Item", itemSchema);
