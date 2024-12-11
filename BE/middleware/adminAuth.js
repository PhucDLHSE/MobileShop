module.exports = function (req, res, next) {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Tài khoản của bạn không có quyền thực hiện chức năng này !' });
    }
    next();
  };
  