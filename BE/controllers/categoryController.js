const Category = require('../models/Category');

// Tạo mới Category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ msg: 'Danh mục này đã tồn tại' });
    }

    category = new Category({ name, description });
    await category.save();

    res.status(201).json({ msg: 'Tạo danh mục mới thành công', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy tất cả Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy một Category theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Không tìm thấy!' });
    }
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cập nhật Category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: 'Không tìm thấy!' });
    }

    res.json({ msg: 'Danh mục đã được cập nhật thành công!', category });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xóa Category
exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
  
      if (!category) {
        return res.status(404).json({ msg: 'Không tìm thấy!' });
      }
  
      res.json({ msg: 'Danh mục đã được xóa thành công' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
};

// Lấy tất cả Categories công khai
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy sản phẩm công khai theo Category
exports.getPublicProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('brand category');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

  