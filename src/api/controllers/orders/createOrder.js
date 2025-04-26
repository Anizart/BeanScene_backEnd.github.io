import User from '../../models/user.js';
import Basket from '../../models/basket.js';
import Order from '../../models/order.js';

//+ Эндпоинт для создания заказа:
export const createOrder = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId, flavor_additive } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не прошел проверку' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'Требуется id продукта' });
        }

        // Получаем адрес пользователя:
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, есть ли этот товар в корзине
        const productInBasket = await Basket.findOne({
            where: { id_user: userId, id_product: productId }
        });

        if (!productInBasket) {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }

        // Создаём заказ с добавками
        await Order.create({
            id_user: userId,
            id_product: productId,
            time: new Date(),
            address: user.address,
            flavor_additive: flavor_additive || "Без добавок"
        });

        // Удаляем товар из корзины
        await productInBasket.destroy();

        res.status(201).json({ message: 'Заказ успешно создан' });

    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};