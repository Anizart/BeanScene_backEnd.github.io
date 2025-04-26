import Product from '../../models/product.js';

//+ Эндпоинт для получения всех продуктов:
export const products = async (req, res) => {
    try {
        const products = await Product.findAll();

        // Возвращаю данные продуктов в формате JSON:
        res.status(200).json(products);
    } catch (error) {
        console.error("Ошибка при выборе продуктов:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
};