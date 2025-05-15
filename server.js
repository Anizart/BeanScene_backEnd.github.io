import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import sequelize from "./src/api/models/index.js"

import authRoutes from "./src/api/routes/auth.js"
import reviewsRoutes from "./src/api/routes/reviews.js"
import basketRoutes from "./src/api/routes/basket.js"
import ordersRoutes from "./src/api/routes/orders.js"
import productsRoutes from "./src/api/routes/products.js"
import subscriptionsRoutes from "./src/api/routes/subscriptions.js"
import userRoutes from "./src/api/routes/user.js"

// import Product from "./src/api/models/product.js"
// import Reviews from "./src/api/models/reviews.js"

const app = express()
const port = 3000

//+ Middleware:
//+ Middleware для разрешения запросов с клиента:
app.use(
  cors({
    origin: "https://bean-scene.tw1.su", // Указываю фронт явно
    credentials: true, // Разрешаю отправку куков
  })
)
app.use(express.static("public"))

//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json())
app.use(cookieParser())

//+ Routes:
app.use("/api/auth", authRoutes)
app.use("/api/reviews", reviewsRoutes)
app.use("/api/basket", basketRoutes)
app.use("/api/orders", ordersRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/subscribe", subscriptionsRoutes)
app.use("/api/user", userRoutes)

//+ Необходимые загрузки для корректной работы приожения:
//+ Продукты:
// await Product.create({
//   img: "uploads/section_3_card_1.webp",
//   name: "Капучино",
//   description: "Кофе 50% | Молоко 50%",
//   price: "80",
// })
// await Product.create({
//   img: "uploads/section_3_card_2.webp",
//   name: "Чай Латте",
//   description: "Кофе 50% | Молоко 50%",
//   price: "79",
// })
// await Product.create({
//   img: "uploads/section_3_card_3.webp",
//   name: "Макиато",
//   description: "Кофе 50% | Молоко 50%",
//   price: "89",
// })
// await Product.create({
//   img: "uploads/section_3_card_4.webp",
//   name: "Эспрессо",
//   description: "Кофе 50% | Молоко 50%",
//   price: "75",
// })
// //+ Создания отзывов:
// await Reviews.create({
//   img: "assets/commentator.png",
//   name: "Александр Иванов",
//   feedback: "Отличный кофе и быстрая доставка! Всем советую.",
// })
// await Reviews.create({
//   img: "assets/commentator.png",
//   name: "Мария Смирнова",
//   feedback: "Очень уютное место и вкусные десерты!",
// })
// await Reviews.create({
//   img: "assets/commentator.png",
//   name: "Дмитрий Петров",
//   feedback: "Обслуживание на высшем уровне, буду заказывать ещё.",
// })

sequelize
  .sync()
  .then(() => {
    // Запуск сервера после успешной синхронизации
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err)
  })
