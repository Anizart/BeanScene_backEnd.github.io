import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs'; // для хэширования
import cookieParser from 'cookie-parser';

const app = express(),
      port = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'public/dataBase.sqlite', // сохраняю в папку public для последующего просмотра
    logging: console.log  // Логирование SQL-запросов
});

//+ Middleware для разрешения запросов с клиента:
app.use(cors());

app.use(express.static('public'));

//+ Добавляю парсер JSON-тела запроса:
app.use(express.json());

//+ Модель таблицы подписок:
const Subscribe = sequelize.define('subscribe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

//+ Модель таблицы пользователей:
const User = sequelize.define('registration', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// + Модель таблицы продуктов:
const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img: {
        type: DataTypes.STRING,  // URL изображения
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// + Модель таблицы заказов:
const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flavor_additive: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Без добавок"
    }
});

// + Модель таблицы корзины:
const Basket = sequelize.define('basket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    id_product: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
    },
});

//+ Установка связей:
Product.hasMany(Basket, { foreignKey: 'id_product' }); // Один продукт может быть в нескольких корзинах
Basket.belongsTo(Product, { foreignKey: 'id_product' }); // Запись в корзине связана с одним продуктом

User.hasMany(Basket, { foreignKey: 'id_user' }); // Один пользователь может иметь несколько записей в корзине
Basket.belongsTo(User, { foreignKey: 'id_user' }); // Запись в корзине принадлежит одному пользователю

User.hasMany(Order, { foreignKey: 'id_user' }); // Один пользователь может делать несколько заказов
Order.belongsTo(User, { foreignKey: 'id_user' });

Product.hasMany(Order, { foreignKey: 'id_product' }); // Один продукт может быть в нескольких заказах
Order.belongsTo(Product, { foreignKey: 'id_product' });

// await sequelize.sync({ force: true }); //+ Для полного пересоздания таблиц
await sequelize.sync(); //+ Синхронизация бд...

//+ Необходимые загрузки для корректной работы приожения:
//+ Продукты:
// await Product.create({
//     img: "img/section_3_card_1.webp",
//     name: "Cappuccino",
//     description: "Coffee 50% | Milk 50%",
//     price: "18.50"
// });
// await Product.create({
//     img: "img/section_3_card_2.webp",
//     name: "Chai Latte",
//     description: "Coffee 50% | Milk 50%",
//     price: "28.50"
// });
// await Product.create({
//     img: "img/section_3_card_3.webp",
//     name: "Macchiato",
//     description: "Coffee 50% | Milk 50%",
//     price: "38.50"
// });
// await Product.create({
//     img: "img/section_3_card_4.webp",
//     name: "Expresso",
//     description: "Coffee 50% | Milk 50%",
//     price: "48.50"
// });

//+ Подключаю middleware для обработки JSON и cookie:
app.use(express.json());
app.use(cookieParser());

//+ Registration:
app.post('/regist', async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //+ Проверка на существование пользователя:
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        //+ Хеширование пароля
        const salt = await bcrypt.genSalt(10); // Генерация соли
        const hashedPassword = await bcrypt.hash(password, salt); // Хеширование пароля

        //+ Создание пользователя с захешированным паролем:
        const newUser = await User.create({
            name,
            email,
            address,
            password: hashedPassword // Сохраняю хешированный пароль
        });

        newUser.save(); //! вот добавил

        console.log("User created:", newUser.toJSON());

        //+ Сохранение userId в cookie на 18 дней:
        res.cookie('userId', newUser.id, {
            httpOnly: true, // Кука доступна только для сервера
            maxAge: 18 * 24 * 60 * 60 * 1000 // 18 дней в миллисекундах
        });

        //+ Ответ клиенту:
        res.status(201).json({ message: "The user has been successfully registered", user: newUser });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//+ Authorization:
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "The user was not found ㄟ( ▔, ▔ )ㄏ" });
        }

        //+ Проверка пароля:
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        //+ Устанавливаем cookie с userId на 18 дней;
        res.cookie('userId', user.id, {
            httpOnly: true, // Кука доступна только для сервера
            maxAge: 18 * 24 * 60 * 60 * 1000 // 18 дней в миллисекундах
        });

        res.status(200).json({ message: "Authorization is successful（￣︶￣）↗" });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Internal server error (＃°Д°)" });
    }
});

//+ Ссылка офиса (прверка):
//+ Эндпоинт для проверки авторизации:
app.get('/check-auth', (req, res) => {
    const userId = req.cookies.userId;

    if (userId) {
        return res.json({isAuthenticated: true});
    } else {
        return res.json({isAuthenticated: false});
    }
});

//+ Эндпоинт для получения данных пользователя:
app.get('/user-profile', async (req, res) => {
    try {
        const userId = req.cookies.userId;

        //+ Проверка наличия userId:
        if (!userId) {
            return res.status(401).json({message: 'Not authorized'});
        }

        //+ Получение пользователя из БД:
        const user = await User.findByPk(userId);

        //+ Проверка существования пользователя:
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //+ Возврат данных пользователя:
        res.status(200).json({
            name: user.name,
            email: user.email,
            address: user.address
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//+ Эндпоинт для обновления профиля пользователя:
app.put('/update-profile', async (req, res) => {
    try {
        const userId = req.cookies.userId;

        // Проверка наличия userId:
        if (!userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, address, password } = req.body;

        // Проверка обязательных полей:
        if (!name || !address || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Поиск пользователя:
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Хэширование нового пароля:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Обновление данных пользователя:
        user.name = name;
        user.address = address;
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//+ Эндпоинт для выхода (Logout):
app.post('/logout', (req, res) => {
    res.clearCookie('userId'); // Удаляю куку с userId
    res.status(200).json({ message: 'Logout successful' });
});

//+ Эндпоинт для получения всех продуктов:
app.get('/products', async (req, res) => {
    try {
        // Получаю все продукты из базы данных:
        const products = await Product.findAll();

        // Возвращаю данные продуктов в формате JSON:
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//+ Эндпоинт для поиска продуктов:
app.get('/search-products', async (req, res) => {
    try {
        const query = req.query.query; // Получаю строку поиска из параметра query

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Поиск продуктов по имени, используя оператор like для частичного совпадения
        const products = await Product.findAll({
            where: {
                name: {
                    [Sequelize.Op.like]: `%${query}%` // Поиск по имени с подстрочными совпадениями
                }
            }
        });

        if (products.length > 0) {
            return res.json(products);
        } else {
            return res.status(404).json({ message: 'No products found' });
        }
    } catch (error) {
        console.error('Error while searching for products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//+ Эндпоинт для добавления товара в корзину:
app.post('/add-to-basket', async (req, res) => {
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
});
//+ Эндпоинт для получения корзины пользователя:
app.get('/get-basket', async (req, res) => {
    try {
        const userId = req.cookies.userId;

        if (!userId) {
            return res.status(401);
        }

        // Получаю записи корзины пользователя вместе с информацией о продуктах:
        const basketItems = await Basket.findAll({
            where: { id_user: userId },
            include: [Product] // Подключаю связанные записи продуктов
        });

        res.status(200).json(basketItems);
    } catch (error) {
        console.error('Error fetching basket:', error);
        res.status(500);
    }
});
//+ Эндпоинт для удаления товара из корзины:
app.delete('/remove-from-basket', async (req, res) => {
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
});

//+ Эндпоинт для создания заказа:
app.post('/create-order', async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const { productId, flavor_additive } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Получаем адрес пользователя:
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Проверяем, есть ли этот товар в корзине
        const productInBasket = await Basket.findOne({
            where: { id_user: userId, id_product: productId }
        });

        if (!productInBasket) {
            return res.status(404).json({ message: 'Product not found in basket' });
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

        res.status(201).json({ message: 'Order created successfully' });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//- ????? УДАЛИ!!!!!
// app.post('/add-additive', async (req, res) => {
//     try {
//         const { productId, additiveId } = req.body;

//         if (!productId || !additiveId) {
//             return res.status(400).json({ message: 'Не переданы productId или additiveId!' });
//         }

//         // Найти продукт (например, в базе данных)
//         const product = await Product.findById(productId);
//         const additive = await Additive.findById(additiveId);

//         if (!product || !additive) {
//             return res.status(404).json({ message: 'Продукт или добавка не найдены!' });
//         }

//         // Добавляем добавку к продукту
//         product.additives.push(additive);
//         await product.save();

//         res.json({ message: `Добавка ${additive.name} успешно добавлена!`, product });
//     } catch (error) {
//         console.error('Ошибка на сервере:', error);
//         res.status(500).json({ message: 'Ошибка сервера при добавлении добавки!' });
//     }
// });

//+ Эндпоинт для подсчёта кол-ва заказов, сделанных за сегодня:
app.get('/orders-today', async (req, res) => {
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
});

//+ Эндпоинт для добавления email в таблицу Subscribe
app.post('/subscribe', async (req, res) => {
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
});

app.listen(port, () => {
    console.log(`the server is running, the port is: ${port}`);
});