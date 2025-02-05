const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");


const Categorias = sequelize.define("categorias", { 
    categoria_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoria_descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
}, {
      timestamps: true,
      paranoid: true,
});

module.exports = Categorias; 