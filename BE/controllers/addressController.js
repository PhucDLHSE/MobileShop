const Address = require('../models/Address');

// Thêm Address mới
exports.createAddress = async (req, res) => {
  try {
    const { name, address, isDefault } = req.body;
    const userId = req.user.id;

    const newAddress = new Address({
      user: userId,
      name,
      address,
      isDefault,
    });

    await newAddress.save();
    res.status(201).json({ msg: 'Address added successfully', newAddress });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy tất cả Address của một User
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId });
    res.status(200).json(addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xóa Address
exports.deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;

    // Tìm địa chỉ theo ID và user ID
    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    // Kiểm tra nếu địa chỉ là địa chỉ mặc định
    if (address.isDefault) {
      return res.status(400).json({ msg: 'Cannot delete default address' });
    }

    // Xóa địa chỉ nếu không phải là địa chỉ mặc định
    await Address.findByIdAndDelete(addressId);

    res.status(200).json({ msg: 'Address removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//Cập nhật địa chỉ mặc định
exports.setDefaultAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.id;

    // Đặt tất cả các địa chỉ khác của người dùng thành không mặc định
    await Address.updateMany({ user: userId }, { isDefault: false });

    // Đặt địa chỉ mới là mặc định
    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    res.status(200).json({ msg: 'Default address updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



