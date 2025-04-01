import Subscribe from '../../models/subscribe.js';

//+ Эндпоинт для добавления email в таблицу Subscribe
export const subscribeEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Проверяю, что email был передан:
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Проверяю, существует ли уже такой email в базе:
        const existingEmail = await Subscribe.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'This email is already subscribed' });
        }

        // Добавляю email:
        const newSubscription = await Subscribe.create({ email });
        console.log('New subscriber:', newSubscription.toJSON());

        res.status(201).json({ message: 'Successfully subscribed', subscriber: newSubscription });
    } catch (error) {
        console.error('Error during subscription:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};