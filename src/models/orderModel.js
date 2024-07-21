const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        product: {
          type: ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
