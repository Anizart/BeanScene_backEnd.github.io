import User from "../../models/user.js"
import Basket from "../../models/basket.js"
import Order from "../../models/order.js"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config() // Загрузка переменных окружения

//+ Эндпоинт для создания заказа:
export const createOrder = async (req, res) => {
  try {
    const userId = req.cookies.userId
    const { products, time } = req.body

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Пользователь не прошел проверку" })
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Нет товаров для заказа" })
    }

    // Получаем адрес пользователя:
    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" })
    }

    //+ Подготовка данных для чека:
    const checkItems = []
    let totalPrice = 0

    // Массив для успешных заказов:
    const createdOrders = []

    // Обрабатываю каждый товар из корзины:
    for (const item of products) {
      if (!item.id_basket || !item.additives) {
        console.log("Некорректные данные товара:", item)
        continue // Если данные товара неполные, пропускаю
      }

      // Поиск товара в корзине пользователя:
      const basketItem = await Basket.findOne({
        where: { id_user: userId, id: item.id_basket },
      })

      if (!basketItem) {
        console.log(`Товар с id_product ${item.id_basket} не найден в корзине.`)
        continue // Если товара нет в корзине, пропускаем
      }

      const product = await basketItem.getProduct()

      //+ Цена товара + добавки:
      const additivesList =
        item.additives !== "Без добавок" ? item.additives.split(",") : []
      const additivesPrice = additivesList.length * 25
      const productTotal = parseFloat(product.price) + additivesPrice
      totalPrice += productTotal

      //+ Начисляю бонусы:
      const BONUS_PERCENT = 5
      const bonusPointsToAdd = Math.floor(totalPrice * (BONUS_PERCENT / 100))
      user.bonuses += bonusPointsToAdd
      await user.save()

      //+ Добавляю в список для чека
      checkItems.push({
        name: product.name,
        additives: additivesList.join(", ") || "Без добавок",
        price: productTotal.toFixed(2),
      })

      // Создаю заказ
      const order = await Order.create({
        id_user: userId,
        id_product: basketItem.id_product,
        time,
        date: new Date(),
        address: user.address,
        additives: item.additives || "Без добавок",
      })

      // Удаляю товар из корзины
      await basketItem.destroy()

      // Добавляю заказ в список успешно созданных
      createdOrders.push(order)
    }

    // Если не удалось создать ни одного заказа
    if (createdOrders.length === 0) {
      return res
        .status(400)
        .json({ message: "Не удалось создать ни одного заказа" })
    }

    //+ Отправка чека:
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const itemsHtml = checkItems
      .map(
        (item) => `
      <div style="margin-bottom: 10px;">
        <strong>${item.name}</strong> (${item.additives})<br/>
        Цена: ₽${item.price}
      </div>
    `
      )
      .join("")

    const html = `
      <div style="background-color:#fdf6f0;padding:20px;font-family:Arial,sans-serif;color:#4e342e;">
        <h2>Ваш чек</h2>
        <p><strong>Имя:</strong> ${user.name}</p>
        <p><strong>Время получения:</strong> ${time}</p>
        <hr/>
        ${itemsHtml}
        <hr/>
        <p><strong>Итого:</strong> ₽${totalPrice.toFixed(2)}</p>
        <p>Спасибо за покупку!</p>
        <p>До скорой встречи в BeanScene!</p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Ваш заказ оформлен — чек",
      html,
    })

    res.status(201).json({
      message: `Заказ успешно создан. Вам начисленны бонусы: ${user.bonuses}`,
    })
  } catch (error) {
    console.error("Ошибка при создании заказа:", error)
    res.status(500).json({ message: "Внутренняя ошибка сервера" })
  }
}
