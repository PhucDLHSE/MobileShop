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

    const address = await Address.findOneAndRemove({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ msg: 'Address not found' });
    }

    res.status(200).json({ msg: 'Address removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
