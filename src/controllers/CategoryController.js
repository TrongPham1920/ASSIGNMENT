const express = require("express");
const Category = require("../models/categoryModel");

exports.getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send({
      code: 0,
      data: categories,
      mess: "Danh mục đã được lấy thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

// Thêm mới danh mục
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).send({
      code: 0,
      data: newCategory,
      mess: "Danh mục đã được tạo thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({ code: 1, mess: "Danh mục không tìm thấy" });
    }

    res.status(200).send({
      code: 0,
      data: updatedCategory,
      mess: "Danh mục đã được cập nhật thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

// Chuyển trạng thái danh mục
exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).send({ code: 1, mess: "Danh mục không tìm thấy" });
    }

    category.status = !category.status;
    await category.save();

    res.status(200).send({
      code: 0,
      data: category,
      mess: "Trạng thái danh mục đã được cập nhật thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};
