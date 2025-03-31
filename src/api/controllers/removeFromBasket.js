import Basket from '../models/basket.js';

//+ Эндпоинт для удаления товара из корзины:
export const removeFromBasket = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Находим один товар в корзине
        const productInBasket = await Basket.findOne({
            where: {
                id_user: userId,
                id_product: productId
            }
        });

        if (productInBasket) {
            await productInBasket.destroy();

            // Проверяем, остались ли еще товары в корзине
            const remainingItems = await Basket.findAll({ where: { id_user: userId } });

            if (remainingItems.length === 0) {
                return res.status(200).json({ message: 'Basket is empty' }); // Сообщаем фронту, что корзина пустая
            }

            return res.status(200).json({ message: 'Product removed from basket successfully' });
        } else {
            return res.status(404).json({ message: 'Product not found in basket' });
        }
    } catch (error) {
        console.error('Error removing product from basket:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};