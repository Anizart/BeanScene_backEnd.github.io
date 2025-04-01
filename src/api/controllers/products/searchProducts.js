import { Sequelize } from "sequelize";
import Product from "../../models/product.js";
import { RESPONSE_ERRORS } from "../../../shared/errors.js";

//+ Эндпоинт для поиска продуктов:
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.query; // Получаю строку поиска из параметра query

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Поиск продуктов по имени, используя оператор like для частичного совпадения
    const products = await Product.findAll({
      where: {
        name: {
          [Sequelize.Op.like]: `%${query}%`, // Поиск по имени с подстрочными совпадениями
        },
      },
    });

    if (products.length > 0) {
      return res.json(products);
    } else {
      return res.status(404).json(RESPONSE_ERRORS.NOT_FOUND);
    }
  } catch (error) {
    res.status(500).json(RESPONSE_ERRORS.EXTERNAL_SERVER_ERROR);
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id } });
    if (!product) {
      return res.status(404).json(RESPONSE_ERRORS.NOT_FOUND);
    }
    return res.json(product);
  } catch (e) {
    console.log(e);
    res.status(500).json(RESPONSE_ERRORS.EXTERNAL_SERVER_ERROR);
  }
};
