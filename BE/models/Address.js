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

// Tối đa 5 địa chỉ/1 User
AddressSchema.pre('save', async function(next) {
  const userAddresses = await this.model('Address').countDocuments({ user: this.user });
  if (userAddresses >= 5 && !this.isDefault) {
    throw new Error('Bạn chỉ có thể thêm tối đa 5 địa chỉ.');
  }
  if (this.isDefault) {
    await this.model('Address').updateMany({ user: this.user, _id: { $ne: this._id } }, { isDefault: false });
  }
  next();
});

module.exports = mongoose.model('Address', AddressSchema);
