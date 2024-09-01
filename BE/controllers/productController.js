const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Category = require('../models/Category');

// Tạo mới Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, status, brand, category, description, images, quantity } = req.body;
      
    const brandExists = await Brand.findById(brand);
    const categoryExists = await Category.findById(category);

    if (!brandExists || !categoryExists) {
      return res.status(400).json({ msg: 'Brand or Category not found' });
    }

    const product = new Product({
      name,
      price,
      status,
      brand,
      category,
      description,
      images,
      quantity,
    });

    await product.save();
    res.status(201).json({ msg: 'Product created successfully', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy tất cả Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('brand category');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy một Product theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('brand category');
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cập nhật Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, status, brand, category, description, images, quantity } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Cập nhật thông tin sản phẩm
    product.name = name || product.name;
    product.price = price || product.price;
    product.status = status || product.status;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.description = description || product.description;
    product.images = images || product.images;
    product.quantity = quantity !== undefined ? quantity : product.quantity;

    await product.save();
    res.json({ msg: 'Product updated successfully', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xóa Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy sản phẩm theo Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('brand category');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy sản phẩm theo Brand
exports.getProductsByBrand = async (req, res) => {
  try {
    const products = await Product.find({ brand: req.params.brandId }).populate('brand category');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
