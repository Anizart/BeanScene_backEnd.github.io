import Order from '../../models/order.js';

//+ Эндпоинт для подсчёта кол-ва заказов, сделанных за сегодня:
export const ordersToday = async (req, res) => {
    try {
        const todayStart = new Date(),
              todayEnd = new Date();

        todayStart.setHours(0, 0, 0, 0); // Начало сегодняшнего дня
        todayEnd.setHours(23, 59, 59, 999); // Конец сегодняшнего дня

        // Подсчёт заказов, сделанных за сегодня:
        const orderCount = await Order.count({
            where: {
                time: {
                    [Sequelize.Op.between]: [todayStart, todayEnd] // Только заказы в пределах сегодняшнего дня
                }
            }
        });

        res.status(200).json({ count: orderCount });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500);
    }
};