import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from './user.js';
import Product from './product.js';

const Basket = sequelize.define('basket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    id_product: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id',
        },
        allowNull: false,
    },
    additives: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Без добавок"
    }
},
{
    timestamps: false,
});

User.hasMany(Basket);
Basket.belongsTo(User);
Product.hasMany(Basket);
Basket.belongsTo(Product, { foreignKey: 'id_product' });

export default Basket;