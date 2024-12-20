const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Thêm sản phẩm vào giỏ hàng
exports.addProductToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    const product = await Product.findById(productId); 

    if (!product) {
      return res.status(404).json({ msg: 'Không tìm thấy sản phẩm' });
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

      if (productIndex !== -1) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
        cart.products[productIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({ 
      msg: 'Sản phẩm đã được thêm vào giỏ hàng', 
      cart, 
      addedProduct: { 
        id: productId, 
        name: product.name 
      } 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Xóa sản phẩm khỏi giỏ hàng
exports.removeProductFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json({ msg: 'Giỏ hàng không tồn tại' });
    }

    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ msg: 'Sản phẩm đã được xóa khỏi giỏ hàng', cart });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Xem tất cả sản phẩm trong giỏ hàng
exports.viewCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('products.product', 'name price images');

    if (!cart) {
      return res.status(400).json({ msg: 'Giỏ hàng trống' });
    }
    cart.products = cart.products.filter(item => item.product !== null);

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};



