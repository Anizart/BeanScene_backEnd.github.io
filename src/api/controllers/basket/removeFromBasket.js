import Basket from '../../models/basket.js';

//+ Эндпоинт для удаления товара из корзины:
export const removeFromBasket = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не прошел проверку' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'Требуется id продукта' });
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
                return res.status(200).json({ message: 'Корзина пуста' }); // Сообщаем фронту, что корзина пустая
            }

            return res.status(200).json({ message: 'Товар успешно извлечен из корзины' });
        } else {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }
    } catch (error) {
        console.error('Ошибка при удалении товара из корзины:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};