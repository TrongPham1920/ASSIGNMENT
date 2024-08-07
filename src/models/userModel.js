const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} không phải là email hợp lệ!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10,11}$/.test(v);
        },
        message: (props) =>
          `${props.value} không phải là số điện thoại hợp lệ!`,
      },
    },
    avatar: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Number,
      default: 1,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
