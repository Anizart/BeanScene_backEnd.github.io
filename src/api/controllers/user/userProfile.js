import User from "../../models/user.js";

//+ Эндпоинт для получения данных пользователя:
export const userProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    //+ Проверка наличия userId:
    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    //+ Получение пользователя из БД:
    const user = await User.findByPk(userId);

    //+ Проверка существования пользователя:
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //+ Возврат данных пользователя:
    res.status(200).json({
      name: user.name,
      email: user.email,
      address: user.address,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
