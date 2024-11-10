// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');


// Helper function to generate a random order code
function generateOrderCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let code = '';
    for (let i = 0; i < 4; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 5; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
}

// Function to ensure the order code is unique
async function getUniqueOrderCode() {
    let code;
    let isUnique = false;
    
    while (!isUnique) {
        code = generateOrderCode();
        const existingOrder = await Order.findOne({ orderCode: code });
        if (!existingOrder) {
            isUnique = true;
        }
    }
    return code;
}

exports.createOrder = async (req, res) => {
    try {
        const { fullName, phoneNumber, paymentMethod, city, district, ward, notes } = req.body;
        const userId = req.user.id;
        const orderCode = await getUniqueOrderCode();

        // Lấy thông tin giỏ hàng từ CSDL hoặc từ dữ liệu người dùng
        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        // Tính tổng tiền
        let totalAmount = 0;
        cart.products.forEach(item => {
            const price = parseFloat(item.product.price.replace(/,/g, '')); // Chuyển đổi giá sang số
            totalAmount += price * item.quantity;
        });

        // Kiểm tra xem totalAmount có hợp lệ không
        if (isNaN(totalAmount)) {
            return res.status(400).json({ error: 'Tổng tiền không hợp lệ' });
        }

        // Tạo đơn hàng với thông tin chi tiết mà người dùng nhập từ trang xác nhận
        const order = new Order({
            user: userId,
            orderCode: orderCode,
            fullName, // Lưu trực tiếp tên người dùng nhập
            phoneNumber, // Lưu trực tiếp số điện thoại người dùng nhập
            address: ` ${ward}, ${district}, ${city}`, // Lưu địa chỉ chi tiết từ trang xác nhận
            items: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            paymentMethod,
            totalAmount,
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
            .populate({
                path: 'items.product',
                select: 'name price images'
            });

        // Tạo danh sách đơn hàng với các thông tin người dùng đã nhập
        const orderData = orders.map(order => ({
            fullName: order.fullName,
            phoneNumber: order.phoneNumber,
            address: order.address,
            paymentMethod: order.paymentMethod,
            notes: order.notes || 'Không có ghi chú',
            orderCode: order.orderCode,
            items: order.items,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt
        }));

        res.status(200).json(orderData);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


exports.getOrderByCode = async (req, res) => {
    try {
        const { orderCode } = req.params;
        const order = await Order.findOne({ orderCode })
            .populate({
                path: 'items.product',
                select: 'name price images'
            });

        if (!order) {
            return res.status(404).json({ msg: 'Đơn hàng không tồn tại' });
        }

        // Trả về thông tin đơn hàng với các trường người dùng nhập từ trang xác nhận
        res.status(200).json({
            fullName: order.fullName,
            phoneNumber: order.phoneNumber,
            address: order.address,
            paymentMethod: order.paymentMethod,
            notes: order.notes || 'Không có ghi chú',
            orderCode: order.orderCode,
            items: order.items,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
