import Product from '../../models/product.js';

//+ Эндпоинт для получения всех продуктов:
export const products = async (req, res) => {
    try {
        // Получаю все продукты из базы данных:
        const products = await Product.findAll();

        // Возвращаю данные продуктов в формате JSON:
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};