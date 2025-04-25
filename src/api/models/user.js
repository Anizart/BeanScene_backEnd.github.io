import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bonuses: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
    
},
{
    timestamps: false,
});

export default User;
