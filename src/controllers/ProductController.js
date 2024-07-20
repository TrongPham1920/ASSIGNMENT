const express = require("express");
const Product = require("../models/productModel");

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

exports.filterProducts = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    if (!minPrice || !maxPrice) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp khoảng giá tiền hợp lệ." });
    }

    const products = await Product.find({
      price: {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi trong quá trình tìm kiếm sản phẩm.",
      error,
    });
  }
};
