const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

// Giới hạn số lượng Address mà một User có thể thêm (tối đa 5)
AddressSchema.pre('save', async function(next) {
  const userAddresses = await this.model('Address').countDocuments({ user: this.user });
  if (userAddresses >= 5 && !this.isDefault) {
    throw new Error('User can have a maximum of 5 addresses.');
  }

  if (this.isDefault) {
    // Nếu address này được đặt là mặc định, thì các address khác của user này phải được bỏ mặc định
    await this.model('Address').updateMany({ user: this.user, _id: { $ne: this._id } }, { isDefault: false });
  }

  next();
});

module.exports = mongoose.model('Address', AddressSchema);
