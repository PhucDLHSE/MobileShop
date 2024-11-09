// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
    try {
        const { fullName, phoneNumber, addressId, paymentMethod, city, district, ward, notes } = req.body;
        const userId = req.user.id;

        // Lấy thông tin giỏ hàng từ CSDL hoặc từ dữ liệu người dùng
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        // Tính tổng tiền
        let totalAmount = 0;
        cart.products.forEach(item => {
            const price = parseFloat(item.product.price);
            totalAmount += price * item.quantity;
        });

        // Kiểm tra xem totalAmount có hợp lệ không
        if (isNaN(totalAmount)) {
            return res.status(400).json({ error: 'Tổng tiền không hợp lệ' });
        }

        // Tạo đơn hàng
        const order = new Order({
            user: userId,
            fullName,
            items: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            address: {
                _id: addressId,
                city,
                district,
                ward
            },
            paymentMethod,
            totalAmount,
            city,
            district,
            ward,
            notes
        });

        // Lưu đơn hàng vào CSDL
        await order.save();

        // Xóa tất cả các sản phẩm trong giỏ hàng của người dùng sau khi đặt hàng thành công
        cart.products = [];
        await cart.save();

        res.status(201).json({ msg: 'Đơn hàng đã được đặt thành công', order });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email') // Lấy thông tin người dùng (tuỳ chọn)
            .populate('items.product', 'name price') // Lấy thông tin sản phẩm (tuỳ chọn)
            .populate('address'); // Lấy thông tin địa chỉ (tuỳ chọn)

        // Cấu trúc dữ liệu trả về
        const orderData = orders.map(order => ({
            user: order.user,
            items: order.items,
            address: order.address,
            paymentMethod: order.paymentMethod,
            totalAmount: order.totalAmount,
            city: order.city,
            district: order.district,
            ward: order.ward,
            notes: order.notes,
            createdAt: order.createdAt,
        }));

        res.status(200).json(orderData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// controllers/orderController.js
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findById(orderId)
            .populate('user', 'name phoneNumber')
            .populate({
                path: 'items.product',
                select: 'name price images', // Populate images along with name and price
            })
            .populate('address');

        if (!order) {
            return res.status(404).json({ msg: 'Đơn hàng không tồn tại' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
