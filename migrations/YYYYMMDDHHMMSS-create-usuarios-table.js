module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('usuarios', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        correoElectronico: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        rol: {
          type: Sequelize.ENUM,
          values: ["admin", "usuario"],
          defaultValue: "usuario",
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
      await queryInterface.dropTable('usuarios');
    },
  };