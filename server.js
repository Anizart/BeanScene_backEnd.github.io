import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./src/api/models/index.js";

import authRoutes from "./src/api/routes/auth.js";
import basketRoutes from "./src/api/routes/basket.js";
import ordersRoutes from "./src/api/routes/orders.js";
import productsRoutes from "./src/api/routes/products.js";
import subscriptionsRoutes from "./src/api/routes/subscriptions.js";
import userRoutes from "./src/api/routes/user.js";

const app = express();
const port = 3000;

//+ Middleware:
//+ Middleware для разрешения запросов с клиента:
app.use(
  cors({
    origin: "http://localhost:5173", // Указываю фронт явно
    credentials: true, // Разрешаю отправку куков
  })
);
app.use(express.static("public"));

//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json());
app.use(cookieParser());

//+ Routes:
app.use("/api/auth", authRoutes);
app.use("/api/basket", basketRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/subscribe", subscriptionsRoutes);
app.use("/api/user", userRoutes);

sequelize
  .sync()
  .then(() => {
    // Запуск сервера после успешной синхронизации
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database synchronization failed:", err);
  });
