const express = require("express");
const User = require("../models/userModel");
const dayjs = require("dayjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.send({
      code: 0,
      data: users,
      mess: "Lấy danh sách người dùng thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

// Read a User by ID
exports.readUser = async (req, res) => {
  try {
    const Id = req.params.id;

    if (!Id) {
      return res
        .status(400)
        .send({ code: 1, mess: "Thiếu thông tin id người dùng" });
    }

    const user = await User.findById(Id).populate("posts").exec();

    if (!user) {
      return res
        .status(404)
        .send({ code: 1, mess: `Không tìm thấy UserID ${Id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: `Thông tin tài khoản ${user?.userName}`,
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

// Update a User by ID
exports.updateUser = async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      address,
      avatar,
      fullName,
      phone,
      dateOfBirth,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ code: 1, mess: "Thiếu thông tin id người dùng" });
    }

    const updatedFields = {};
    if (phone) updatedFields.phone = phone;
    if (fullName) updatedFields.fullName = fullName;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password;
    if (address) updatedFields.address = address;
    if (avatar) updatedFields.avatar = avatar;
    if (dateOfBirth) updatedFields.dateOfBirth = dateOfBirth;

    const user = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .send({ code: 1, mess: `Không tìm thấy UserID ${id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: "Cập nhật thông tin người dùng thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

// Delete a User by ID
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res
        .status(400)
        .send({ code: 1, mess: "Thiếu thông tin id người dùng" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .send({ code: 1, mess: `Không tìm thấy UserID ${id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: `Xóa user ${id} thành công`,
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id) {
      return res
        .status(400)
        .send({ code: 1, mess: "Thiếu thông tin id người dùng" });
    }

    if (typeof status !== "boolean") {
      return res.status(400).send({ code: 1, mess: "Trạng thái không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res
        .status(404)
        .send({ code: 1, mess: `Không tìm thấy UserID ${id}` });
    }

    res.send({
      code: 0,
      data: user,
      mess: "Cập nhật trạng thái người dùng thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};
