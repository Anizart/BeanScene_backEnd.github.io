import User from "../../models/user.js";

//+ Эндпоинт для получения данных пользователя:
export const userProfile = async (req, res) => {
  try {
    const userId = req.cookies.userId;

    //+ Проверка наличия userId:
    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    //+ Получение пользователя из БД:
    const user = await User.findByPk(userId);

    //+ Проверка существования пользователя:
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    //+ Возврат данных пользователя:
    res.status(200).json({
      name: user.name,
      email: user.email,
      address: user.address,
      bonuses: user.bonuses,
    });
  } catch (error) {
    console.error("Ошибка при получении пользовательских данных:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
