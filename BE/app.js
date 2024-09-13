const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const addressRoutes = require('./routes/address');
const userRoutes = require('./routes/user');

dotenv.config();
connectDB();

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// Sử dụng routes cho các API
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);

// Cấu hình để phục vụ các file tĩnh trong thư mục 'frontend'
app.use(express.static(path.join(__dirname, '../fe')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../fe/index.html'));
});

app.get('/product-details/:id', (req, res) => {
    const productId = req.params.id;
    res.sendFile(path.join(__dirname, '../fe/product-details.html'));
});

app.get('/product-dt/:id', (req, res) => {
    const productId = req.params.id;
    res.sendFile(path.join(__dirname, '../fe/product-dt.html'));
});

// Kết nối routes cho user
app.use('/api/users', userRoutes);


//Cors
app.use(cors());


// Thiết lập route cho trang đăng nhập
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../fe/login.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
