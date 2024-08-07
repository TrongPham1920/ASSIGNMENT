const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password, phone } = req.body;

    let user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (user) {
      return res
        .status(400)
        .send({ code: 1, mess: "Username hoặc email hoặc phone Đã tồn tại" });
    }

    const newUser = new User({
      email,
      password,
      phone,
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();
    res
      .status(201)
      .send({ code: 0, data: newUser, mess: "Tạo user thành công" });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.status(400).send({ code: 1, mess: "Email không tồn tại!!!" });

    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword)
      return res.status(400).send({ code: 1, mess: "Sai mật khẩu!!!" });

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;

    const responseData = {
      user: rest,
      token: token,
    };

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ code: 0, mess: "Đăng nhập thành công", data: responseData });
  } catch (error) {
    res.status(400).send({ code: 1, mess: error?.message });
  }
};
