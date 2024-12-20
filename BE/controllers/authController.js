const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
  const { fullName, phoneNumber, dateOfBirth, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email đã tồn tại' });
    }
    user = new User({
      fullName,
      phoneNumber,
      dateOfBirth,
      email,
      password,
      role
    });
    await user.save();
    res.status(201).json({ msg: 'Đăng ký thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Đăng nhập
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email hoặc mật khẩu không chính xác' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ msg: 'Tài khoản này đã bị chặn' });
    }

    if (password !== user.password) {
      return res.status(400).json({ msg: 'Sai mật khẩu' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, fullName: user.fullName, msg: 'Đăng nhập thành công' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
