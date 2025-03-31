//+ Эндпоинт для выхода (Logout):
export const logout = (req, res) => {
    res.clearCookie('userId'); // Удаляю куку с userId
    res.status(200).json({ message: 'Logout successful' });
};