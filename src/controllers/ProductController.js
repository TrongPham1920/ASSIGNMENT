const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/productModel");

exports.filterProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      category,
      sortByDate,
      page = 0,
      limit = 10,
    } = req.query;

    let query = {};

    if (minPrice) {
      const minPriceValue = parseFloat(minPrice);
      if (isNaN(minPriceValue) || minPriceValue < 0) {
        return res.status(400).send({
          code: 1,
          mess: "Giá tối thiểu phải là số dương",
        });
      }
      query.price = { ...query.price, $gte: minPriceValue };
    }

    if (maxPrice) {
      const maxPriceValue = parseFloat(maxPrice);
      if (isNaN(maxPriceValue) || maxPriceValue < 0) {
        return res.status(400).send({
          code: 1,
          mess: "Giá tối đa phải là số dương",
        });
      }
      query.price = { ...query.price, $lte: maxPriceValue };
    }

    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categories = new mongoose.Types.ObjectId(category);
      } else {
        return res.status(400).send({
          code: 1,
          mess: "ID danh mục không hợp lệ",
        });
      }
    }

    const skip = page * limit;
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("-status -description -type")
      .populate({
        path: "categories",
        select: "name _id",
      })
      .sort(sortByDate === "newest" ? { createdAt: -1 } : { createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).send({
      code: 0,
      data: products,
      total: totalProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Sản phẩm đã được lọc thành công",
    });
  } catch (error) {
    console.error("Error in filterProducts:", error);
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const Products = await Product.find()
      .select("-status -description -type")
      .populate({
        path: "categories",
        select: "name _id",
      });

    res.status(200).send({
      code: 0,
      mess: "Sản phẩm đã được lấy thành công",
      total: totalProducts,
      data: Products,
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const skip = page * limit;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .select("-status -description -type")
      .populate({
        path: "categories",
        select: "name _id",
      })
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      code: 0,
      total: totalProducts,
      data: products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Sản phẩm đã được lấy thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const {
    name,
    price,
    shortDescription,
    categories,
    images,
    keywords,
    stock,
    description,
    dimensions,
    type,
  } = req.body;

  if (!name || !price || !categories) {
    return res.status(400).send({
      code: 1,
      mess: "Thiếu thông tin bắt buộc",
    });
  }

  const newProduct = new Product({
    name,
    price,
    shortDescription,
    categories,
    images,
    keywords,
    stock,
    description,
    dimensions,
    type,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).send({
      code: 0,
      data: savedProduct,
      mess: "Sản phẩm đã được tạo thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).send({
      code: 1,
      mess: "Thiếu ID sản phẩm",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).send({
        code: 1,
        mess: "Sản phẩm không tìm thấy",
      });
    }

    res.status(200).send({
      code: 0,
      data: updatedProduct,
      mess: "Sản phẩm đã được cập nhật thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send({ code: 1, mess: "Danh mục không tìm thấy" });
    }

    product.status = !product.status;
    await product.save();

    res.status(200).send({
      code: 0,
      data: product,
      mess: "Trạng thái danh mục đã được cập nhật thành công",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const skip = page * limit;

    const totalProducts = await Product.countDocuments({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { keywords: { $in: [searchTerm] } },
      ],
    });

    const products = await Product.find({
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { keywords: { $in: [searchTerm] } },
      ],
    })
      .select("-status -description -type")
      .skip(skip)
      .limit(limit)
      .populate({
        path: "categories",
        select: "name _id",
      });

    res.status(200).send({
      code: 0,
      total: totalProducts,
      data: products,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
      mess: "Sản phẩm đã được tìm thấy",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "categories",
      select: "name _id",
    });

    if (!product) {
      return res
        .status(404)
        .send({ code: 1, mess: "Sản phẩm không được tìm thấy" });
    }

    res.status(200).send({
      code: 0,
      data: product,
      mess: "Sản phẩm đã được tìm thấy",
    });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error.message });
  }
};
