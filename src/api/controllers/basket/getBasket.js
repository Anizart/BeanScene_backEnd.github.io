import Basket from '../../models/basket.js';
import Product from '../../models/product.js';

//+ Эндпоинт для получения корзины пользователя:
export const getBasket = async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.status(401);
        }

        // Получаю записи корзины пользователя вместе с информацией о продуктах:
        const basketItems = await Basket.findAll({
            where: { id_user: userId },
            include: [Product], // Подключаю связанные записи продуктов
            attributes: ["id", "additives"]
        });

        res.status(200).json(basketItems);
    } catch (error) {
        console.error('Error fetching basket:', error);
        res.status(500);
    }
};