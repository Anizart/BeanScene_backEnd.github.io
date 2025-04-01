import bcrypt from "bcryptjs";
import User from "../../models/user.js";

//+ Эндпоинт для обновления профиля пользователя:
export const updateProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    // Проверка наличия userId:
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, address, password } = req.body;

    // Проверка обязательных полей:
    if (!name || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Поиск пользователя:
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Хэширование нового пароля:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Обновление данных пользователя:
    user.name = name;
    user.address = address;
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
