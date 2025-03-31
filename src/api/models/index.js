import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'src/database/dataBase.sqlite',
    logging: console.log  // Логирование SQL-запросов
});

export default sequelize;