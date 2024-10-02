// controllers/userController.js

const User = require('../models/User');
const Address = require('../models/Address');

// Show profile of the logged-in user
exports.getUserProfile = async (req, res) => {
  try {
    // Find the user by ID (without password) and populate their addresses
    const user = await User.findById(req.user.id).select('-password');
    const addresses = await Address.find({ user: req.user.id });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return the user profile with associated addresses
    res.json({
      user,
      addresses,  // Including addresses in the response
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Cập nhật thông tin của user đang đăng nhập
exports.updateUserProfile = async (req, res) => {
    const { fullName, phoneNumber, dateOfBirth } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin
        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;

        await user.save();
        res.json({ msg: 'Thông tin cá nhân đã được cập nhật', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// Admin: Lấy thông tin của một user
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// Admin: Lấy danh sách tất cả user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// Admin: Xóa một user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        await user.remove();
        res.json({ msg: 'Người dùng đã bị xóa' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};

// Admin: Cập nhật thông tin của một user
exports.updateUserById = async (req, res) => {
    const { fullName, phoneNumber, dateOfBirth, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin
        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.dateOfBirth = dateOfBirth || user.dateOfBirth;
        user.role = role || user.role;

        await user.save();
        res.json({ msg: 'Thông tin người dùng đã được cập nhật', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};
