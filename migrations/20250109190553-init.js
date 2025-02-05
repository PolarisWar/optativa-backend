'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categorias', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoria_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoria_descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('recetas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      receta_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receta_descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receta_instrucciones: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tiempo_preparacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      categoriaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'categorias',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('ingredientes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ingredientes_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unidad_medida: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recetaId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'recetas',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ingredientes');
    await queryInterface.dropTable('recetas');
    await queryInterface.dropTable('categorias');
  },
};