import bcrypt from 'bcryptjs'; // для хэширования
import User from '../../models/user.js';
 
//+ Registration:
export const register = async (req, res) => {
    try {
        const { name, email, address, password } = req.body;

        if (!name || !email || !address || !password) {
            return res.status(400).json({ message: "Все поля обязательны для заполнения" });
        }

        //+ Проверка на существование пользователя:
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Пользователь с таким адресом электронной почты уже существует" });
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
        res.status(201).json({ message: "Пользователь успешно зарегистрирован", user: newUser });
    } catch (error) {
        console.error("Error during user creation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//+ Authorization:
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Требуется указать адрес электронной почты и пароль" });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Пользователь не был найден ㄟ( ▔, ▔ )ㄏ" });
        }

        //+ Проверка пароля:
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Неверный пароль" });
        }

        //+ Устанавливаем cookie с userId на 18 дней;
        res.cookie('userId', user.id, {
            httpOnly: true, // Кука доступна только для сервера
            maxAge: 18 * 24 * 60 * 60 * 1000 // 18 дней в миллисекундах
        });

        res.status(200).json({ message: "Авторизация прошла успешно（￣︶￣）↗" });
    } catch (error) {
        console.error("Ошибка при авторизации:", error);
        res.status(500).json({ message: "Внутренняя ошибка сервера (＃°Д°)" });
    }
};