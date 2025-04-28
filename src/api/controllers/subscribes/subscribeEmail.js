import Subscribe from '../../models/subscribe.js';

//+ Эндпоинт для добавления email в таблицу Subscribe
export const subscribeEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Проверяю, что email был передан:
        if (!email) {
            return res.status(400).json({ message: 'Требуется электронная почта' });
        }

        // Проверяю, существует ли уже такой email в базе:
        const existingEmail = await Subscribe.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Эта почта занята' });
        }

        // Добавляю email:
        const newSubscription = await Subscribe.create({ email });
        console.log('New subscriber:', newSubscription.toJSON());

        res.status(201).json({ message: 'Вы подписаны', subscriber: newSubscription });
    } catch (error) {
        console.error('Ошибка во время подписки:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
};