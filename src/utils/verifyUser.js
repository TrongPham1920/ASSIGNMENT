const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ code: 1, mess: "Không có token, truy cập bị từ chối" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(errorHandler(403, "Forbidden"));

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({ code: 1, mess: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
