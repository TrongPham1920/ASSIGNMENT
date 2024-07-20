const authorizationMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (role === requiredRole || role === 0) {
      // Cho phép nếu người dùng có vai trò yêu cầu hoặc là admin (role = 0)
      next();
    } else {
      res
        .status(403)
        .send({ code: 1, mess: "Bạn không có quyền truy cập tài nguyên này" });
    }
  };
};

module.exports = authorizationMiddleware;
