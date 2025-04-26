import Basket from '../../models/basket.js';

//+ Эндпоинт для добавления товара в корзину:
export const addToBasket = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId, additives  } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Войдите, чтобы оформить заказ' });
        }

        if (!productId) {
            console.log('Нет продукта');
            return res.status(400);
        }

        // Добавляю запись в таблицу корзины:
        await Basket.create({ id_user: userId, id_product: productId, additives: additives });

        res.status(201).json({ message: 'Корзина пополнена ツ' });
    } catch (error) {
        console.error('Ошибка при добавлении товара в корзину ( сервер ):', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};