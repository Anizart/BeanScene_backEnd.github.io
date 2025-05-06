import User from "../../models/user.js"
import Basket from "../../models/basket.js"
import Order from "../../models/order.js"

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

    // Массив для успешных заказов
    const createdOrders = []

    // Обрабатываем каждый товар из корзины
    for (const item of products) {
      if (!item.id_basket || !item.additives) {
        console.log("Некорректные данные товара:", item)
        continue // Если данные товара неполные, пропускаем
      }

      // Находим товар в корзине пользователя
      const basketItem = await Basket.findOne({
        where: { id_user: userId, id: item.id_basket },
      })

      if (!basketItem) {
        console.log(`Товар с id_product ${item.id_basket} не найден в корзине.`)
        continue // Если товара нет в корзине, пропускаем
      }

      // Создаю заказ
      const order = await Order.create({
        id_user: userId,
        id_product: basketItem.id_product,
        time,
        date: new Date(),
        address: user.address,
        additives: item.additives || "Без добавок",
      })

      // Удаляем товар из корзины
      await basketItem.destroy()

      // Добавляем заказ в список успешно созданных
      createdOrders.push(order)
    }

    // Если не удалось создать ни одного заказа
    if (createdOrders.length === 0) {
      return res
        .status(400)
        .json({ message: "Не удалось создать ни одного заказа" })
    }

    // Ответ с успешным созданием заказов
    res.status(201).json({ message: "Заказ успешно создан" })
  } catch (error) {
    console.error("Ошибка при создании заказа:", error)
    res.status(500).json({ message: "Внутренняя ошибка сервера" })
  }
}
