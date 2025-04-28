import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Reviews = sequelize.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    img: {
        type: DataTypes.STRING,  // URL изображения
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    feedback: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
{
    timestamps: false
});

export default Reviews;