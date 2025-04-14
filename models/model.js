const mongoose = require("mongoose");
const priceHistorySchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null, // null means the price is currently active
    },
  },
  { _id: false }
); // no need for _id on embedded subdocuments

const itemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      trim: true,
    },
    store: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    lowestPrice: {
      type: Number,
      required: false,
    },
    lowestPriceDate: {
      type: Date,
      required: false,
    },
    priceHistory: {
      type: [priceHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
); // adds createdAt and updatedAt

module.exports = mongoose.model("Item", itemSchema);
