import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from './user.js';
import Product from './product.js';

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_product: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flavor_additive: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Без добавок"
    }
});

// ?????:
User.hasMany(Order); // Один пользователь может делать несколько заказов
Order.belongsTo(User);
Product.hasMany(Order);
Order.belongsTo(Product);

export default Order;