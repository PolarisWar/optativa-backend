const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");


const Ingredientes = sequelize.define("ingredientes", {
    ingredientes_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unidad_medida: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = Ingredientes;