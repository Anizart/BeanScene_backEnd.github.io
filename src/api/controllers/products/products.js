import { Op } from "sequelize"
import Product from "../../models/product.js"

//+ Эндпоинт для получения всех продуктов:
export const products = async (req, res) => {
  try {
    const query = req.query.query

    const products = await Product.findAll({
      where: query
        ? {
            name: {
              [Op.like]: `%${query}%`,
            },
          }
        : {},
    })

    // Возвращаю данные продуктов в формате JSON:
    res.status(200).json(products)
  } catch (error) {
    console.error("Ошибка при выборе продуктов:", error)
    res.status(500).json({ message: "Внутренняя ошибка сервера" })
  }
}
