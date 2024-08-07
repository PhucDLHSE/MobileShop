module.exports = function (req, res, next) {
    // Kiểm tra vai trò người dùng từ req.user
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Access denied: Admins only' });
    }
    next();
  };
  