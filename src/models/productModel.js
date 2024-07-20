const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shortDescription: String,
    categories: {
      type: ObjectId,
      ref: "category",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    keywords: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    description: String,
    dimensions: {
      type: {
        width: Number,
        height: Number,
      },
      default: {
        width: 0,
        height: 0,
      },
    },
    type: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("product", productSchema);
