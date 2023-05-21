const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
stocks: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  current_price: {
    type: Number,
    required: true,
  }
});

const StockDetail = new mongoose.model("StockDetail", detailSchema);
module.exports = StockDetail;