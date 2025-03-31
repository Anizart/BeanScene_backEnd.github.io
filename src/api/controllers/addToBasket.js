import Basket from '../models/basket.js';

//+ Эндпоинт для добавления товара в корзину:
export const addToBasket = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Please log in to place an order' });
        }

        if (!productId) {
            console.log('Нет продукта');
            return res.status(400);
        }

        // Добавляю запись в таблицу корзины:
        await Basket.create({ id_user: userId, id_product: productId });

        res.status(201).json({ message: 'Product added to basket successfully' });
    } catch (error) {
        console.error('Error adding product to basket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};