const Brand = require('../models/Brand');

// Tạo Thương hiệu
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    let brand = await Brand.findOne({ name });
    if (brand) {
      return res.status(400).json({ msg: 'Thương hiệu đã tồn tại' });
    }

    brand = new Brand({ name, description });
    await brand.save();

    res.status(201).json({ msg: 'Thương hiệu đã được thêm thành công', brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy tất cả Thương hiệu
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy một Thương hiệu theo ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ msg: 'Không tìm thấy' });
    }
    res.json(brand);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cập nhật Thương hiệu
exports.updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ msg: 'Không tìm thấy' });
    }

    res.json({ msg: 'Cập nhật thành công!', brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xóa 
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ msg: 'Không tìm thấy' });
    }

    res.json({ msg: 'Thương hiệu đã được xóa thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
