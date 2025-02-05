const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Usuario = sequelize.define("usuario", {
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correoElectronico: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rol: {
    type: DataTypes.ENUM,
    values: ["admin", "usuario"],
    defaultValue: "usuario",
  },
});

module.exports = Usuario;