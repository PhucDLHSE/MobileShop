const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const brandRoutes = require('./routes/brand');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Sử dụng routes cho các API
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
