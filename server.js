import express from 'express';
// import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import sequelize from './api/models/index.js';

import addToBasket from './src/api/routes/addToBasket.js';
import authRoutes from './src/api/routes/authRoutes.js';
import checkAuth from './src/api/routes/checkAuth.js';
import createOrder from './src/api/routes/createOrder.js';
import getBasket from './src/api/routes/getBasket.js';
import logout from './src/api/routes/logout.js';
import ordersToday from './src/api/routes/ordersToday.js';
import products from './src/api/routes/products.js';
import removeFromBasket from './src/api/routes/removeFromBasket.js';
import searchProducts from './src/api/routes/searchProducts.js';
import subscribe from './src/api/routes/subscribe.js';
import updateProfile from './src/api/routes/updateProfile.js';
import userProfile from './src/api/routes/userProfile.js';

const app = express(),
      port = 3000;

//+ Middlewareд:
//+ Middleware для разрешения запросов с клиента:
app.use(cors());
// app.use(express.static('public'));
//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json());
app.use(cookieParser());

// await sequelize.sync({ force: true }); //+ Для полного пересоздания таблиц
// await sequelize.sync(); //+ Синхронизация бд...
// Синхронизация базы данных с обработкой ошибок:
async function startServer() {
    try {
        await sequelize.sync(); // или `{ force: true }` для пересоздания таблиц
        console.log('Database synchronized successfully.');

        // Запуск сервера после успешной синхронизации
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Database synchronization failed:', error);
    }
}
startServer();

//+ Routes:
app.use('/api/auth', authRoutes);
app.use('/api/check-auth', checkAuth);
app.use('/api/logout', logout);
app.use('/api/user/profile', userProfile);
app.use('/api/user/update', updateProfile);

app.use('/api/products', products);
app.use('/api/products/search', searchProducts);

app.use('/api/basket', getBasket);
app.use('/api/basket/add', addToBasket);
app.use('/api/basket/remove', removeFromBasket);

app.use('/api/orders', createOrder);
app.use('/api/orders/today', ordersToday);

app.use('/api/subscribe', subscribe);

//+ Необходимые загрузки для корректной работы приожения:
//+ Продукты:
// await Product.create({
//     img: "img/section_3_card_1.webp",
//     name: "Cappuccino",
//     description: "Coffee 50% | Milk 50%",
//     price: "18.50"
// });
// await Product.create({
//     img: "img/section_3_card_2.webp",
//     name: "Chai Latte",
//     description: "Coffee 50% | Milk 50%",
//     price: "28.50"
// });
// await Product.create({
//     img: "img/section_3_card_3.webp",
//     name: "Macchiato",
//     description: "Coffee 50% | Milk 50%",
//     price: "38.50"
// });
// await Product.create({
//     img: "img/section_3_card_4.webp",
//     name: "Expresso",
//     description: "Coffee 50% | Milk 50%",
//     price: "48.50"
// });

app.listen(port, () => {
    console.log(`the server is running, the port is: ${port}`);
});