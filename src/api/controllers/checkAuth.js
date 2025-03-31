//+ Ссылка офиса (прверка):
//+ Эндпоинт для проверки авторизации:
export const checkAuth = (req, res) => {
    const userId = req.cookies.userId;

    if (userId) {
        return res.json({isAuthenticated: true});
    } else {
        return res.json({isAuthenticated: false});
    }
};