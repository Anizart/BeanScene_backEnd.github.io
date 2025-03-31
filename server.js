import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express(),
      port = 3000;

//+ Middleware для разрешения запросов с клиента:
app.use(cors());
app.use(express.static('public'));
//+ Добавляю парсер JSON-тела запроса:
app.use(express.json());
//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json());
app.use(cookieParser());

// await sequelize.sync({ force: true }); //+ Для полного пересоздания таблиц
await sequelize.sync(); //+ Синхронизация бд...

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