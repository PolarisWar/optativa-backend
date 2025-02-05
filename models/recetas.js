const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/database");

const Recetas = sequelize.define("recetas", {
    receta_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receta_descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    receta_instrucciones: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    tiempo_preparacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
}, {
    timestamps: true,
    paranoid: true,
});

const Ingredientes = require("./ingredientes");
const Categorias = require("./categorias");

// Relación de recetas y categorias (muchos a uno)
Recetas.belongsTo(Categorias, {
  foreignKey: {
      name: 'categoriaId',
      allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Categorias.hasMany(Recetas, {
  foreignKey: 'categoriaId'
});

// Relación de ingredientes y recetas (muchos a uno)
Ingredientes.belongsTo(Recetas, {
  foreignKey: {
      name: 'recetaId', 
      allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Recetas.hasMany(Ingredientes, {
  foreignKey: 'recetaId' 
});

module.exports = Recetas;