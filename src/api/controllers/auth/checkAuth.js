//+ Ссылка офиса (прверка):
//+ Эндпоинт для проверки авторизации:
export const checkAuth = (req, res) => {
	const userId = req.cookies?.userId;

	if (!userId) {
		return res.status(401).json({ message: "Not authenticated" });
	}

	return res.status(200).json({ isAuthenticated: true, userId });
};