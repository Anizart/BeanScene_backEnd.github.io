import bcrypt from "bcryptjs";
import User from "../../models/user.js";

//+ Эндпоинт для обновления профиля пользователя:
export const updateProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    // Проверка наличия userId:
    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const { name, address, password } = req.body;

    // Проверка обязательных полей:
    if (!name || !address || !password) {
      return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    // Поиск пользователя:
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // Хэширование нового пароля:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Обновление данных пользователя:
    user.name = name;
    user.address = address;
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Профиль успешно обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
