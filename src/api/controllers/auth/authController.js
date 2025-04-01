import bcrypt from 'bcryptjs'; // для хэширования
import User from '../../models/user.js';
 
//+ Registration:
export const register = async (req, res) => {
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
};

//+ Authorization:
export const login = async (req, res) => {
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
};