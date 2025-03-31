import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Subscribe = sequelize.define('subscribe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

export default Subscribe;