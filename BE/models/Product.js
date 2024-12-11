const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Còn hàng', 'Hết hàng'],
    default: 'Còn hàng',
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  // quantity: {
  //   type: Number,
  //   required: true,
  //   default: 0, 
  // }
});

module.exports = mongoose.model('Product', ProductSchema);
