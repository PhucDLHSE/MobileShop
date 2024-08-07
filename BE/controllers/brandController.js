const Brand = require('../models/Brand');

// Tạo mới Brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    let brand = await Brand.findOne({ name });
    if (brand) {
      return res.status(400).json({ msg: 'Brand already exists' });
    }

    brand = new Brand({ name, description });
    await brand.save();

    res.status(201).json({ msg: 'Brand created successfully', brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy tất cả Brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Lấy một Brand theo ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ msg: 'Brand not found' });
    }
    res.json(brand);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Cập nhật Brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ msg: 'Brand not found' });
    }

    res.json({ msg: 'Brand updated successfully', brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xóa Brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ msg: 'Brand not found' });
    }

    res.json({ msg: 'Brand removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
