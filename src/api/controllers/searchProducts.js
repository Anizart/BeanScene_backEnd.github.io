import { Sequelize } from 'sequelize';
import Product from '../models/product.js';

//+ Эндпоинт для поиска продуктов:
export const searchProducts = async (req, res) => {
    try {
        const query = req.query.query; // Получаю строку поиска из параметра query

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Поиск продуктов по имени, используя оператор like для частичного совпадения
        const products = await Product.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${query}%` // Поиск по имени с подстрочными совпадениями
                }
            }
        });

        if (products.length > 0) {
            return res.json(products);
        } else {
            return res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
        console.error('Error while searching for products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};