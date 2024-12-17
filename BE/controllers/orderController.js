const Order = require('../models/Order');
const Cart = require('../models/Cart');

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
        const { fullName, phoneNumber, paymentMethod, city, district, ward, notes, status } = req.body;
        const userId = req.user.id;
        const orderCode = await getUniqueOrderCode();

        const cart = await Cart.findOne({ user: userId }).populate('products.product');
        
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        let totalAmount = 0;
        cart.products.forEach(item => {
            const price = parseFloat(item.product.price.replace(/,/g, ''));
            totalAmount += price * item.quantity;
        });

        if (isNaN(totalAmount)) {
            return res.status(400).json({ error: 'Tổng tiền không hợp lệ' });
        }

        const order = new Order({
            user: userId,
            orderCode: orderCode,
            fullName, 
            phoneNumber, 
            address: ` ${ward}, ${district}, ${city}`, 
            items: cart.products.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            paymentMethod,
            totalAmount,
            notes, 
            status: status || 'pending'
        });

        await order.save();

        cart.products = [];
        await cart.save();

        res.status(201).json({ msg: 'Đơn hàng đã được đặt thành công', order });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderCode } = req.params; 
        const { status } = req.body;      
        const allowedStatuses = ["pending", "confirmed", "shipping", "completed", "cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Status không hợp lệ (pending, confirmed, shipping, completed, cancelled)"
            });
        }

        const order = await Order.findOne({ orderCode });
        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        // Kiểm tra thứ tự trạng thái
        const currentStatusIndex = allowedStatuses.indexOf(order.status); 
        const newStatusIndex = allowedStatuses.indexOf(status);          

        if (newStatusIndex < currentStatusIndex) {
            return res.status(400).json({
                message: `Không thể cập nhật từ trạng thái '${order.status}' quay lại '${status}'`
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            message: `Trạng thái đơn hàng đã được cập nhật thành: ${status}`,
            order: order
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID:', userId);  // ✅ In User ID

        const orders = await Order.find({ user: userId }).populate({
            path: 'items.product',
            select: 'name price images'
        });

        console.log('Đơn hàng:', JSON.stringify(orders, null, 2));  // ✅ In dữ liệu đơn hàng

        if (!orders.length) {
            return res.status(404).json({ msg: 'Không tìm thấy đơn hàng nào.' });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Lỗi server:', error.message);
        res.status(500).json({ msg: 'Server error', error });
    }
};



exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'items.product',
                select: 'name price images'
            });

        const orderData = orders.map(order => ({
            fullName: order.fullName,
            phoneNumber: order.phoneNumber,
            address: order.address,
            paymentMethod: order.paymentMethod,
            notes: order.notes || 'Không có ghi chú',
            orderCode: order.orderCode,
            items: order.items,
            status: order.status,
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
            status: order.status,
            items: order.items,
            totalAmount: order.totalAmount
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { orderCode } = req.params;
        const order = await Order.findOne({ orderCode });

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        if (order.status !== "cancelled") {
            return res.status(400).json({
                message: "Chỉ có thể xóa đơn hàng có trạng thái 'cancelled'"
            });
        }
        
        await Order.deleteOne({ orderCode });

        res.status(200).json({
            message: `Đơn hàng có mã '${orderCode}' đã được xóa thành công`
        });
    } catch (error) {
        console.error("Lỗi xóa đơn hàng:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
