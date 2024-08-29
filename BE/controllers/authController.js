const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký
exports.register = async (req, res) => {
  const { fullName, phoneNumber, dateOfBirth, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
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

    // Không trả về token sau khi đăng ký
    res.status(201).json({ msg: 'Registration successful, please log in to get your token' });
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
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Kiểm tra mật khẩu (ở đây không mã hóa mật khẩu nên chỉ so sánh trực tiếp)
    if (password !== user.password) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
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
        // Trả về token, role, fullName và thông báo thành công
        res.json({ token, role: user.role, fullName: user.fullName, msg: 'Login successful' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
