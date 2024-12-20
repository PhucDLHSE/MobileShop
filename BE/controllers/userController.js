const User = require('../models/User');
const Address = require('../models/Address');

exports.createUserByAdmin = async (req, res) => {
    const { fullName, phoneNumber, dateOfBirth, email, password, role } = req.body;
  
    try {
      if (role !== 'Admin' && role !== 'Member') {
        return res.status(400).json({ msg: 'Vai trò không hợp lệ. Chỉ có thể là Admin hoặc Member' });
      }

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Email đã tồn tại! Không thể tạo tài khoản.' });
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
      res.status(201).json({ msg: 'Tạo tài khoản thành công' });
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const addresses = await Address.find({ user: req.user.id });

    if (!user) {
      return res.status(404).json({ msg: 'Không tìm thấy người dùng' });
    }
    res.json({
      user,
      addresses, 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateUserProfile = async (req, res) => {
    const { fullName, phoneNumber, dateOfBirth } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Người dùng không tồn tại' });
        }

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

        // Sử dụng deleteOne thay vì remove
        await User.deleteOne({ _id: req.params.id });
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

// Chặn tài khoản
exports.blockUser = async (req, res) => {
    const { userId } = req.params;
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'Không tìm thấy tài khoản' });
      }

      if (user.role === 'Admin') {
        return res.status(400).json({ message: 'Không thể khóa tài khoản Admin.' });
    }

      user.isBlocked = true; 
      await user.save();
      
      res.status(200).json({ message: 'Đã chặn tài khoản này!' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
  // Mở khóa tài khoản
  exports.unblockUser = async (req, res) => {
    const { userId } = req.params;
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      
      user.isBlocked = false;
      await user.save();
      
      res.status(200).json({ message: 'Tài khoản đã được mở khóa' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  
