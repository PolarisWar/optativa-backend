const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');
const logger = require('../logger/logger');

const createAdminUser = async () => {
  try {
    // Verificar si ya existe un admin
    const adminExists = await Usuario.findOne({
      where: {
        rol: 'admin'
      }
    });

    if (!adminExists) {
      // Crear el usuario admin si no existe
      const hashedPassword = await bcrypt.hash('123456', 10);
      
      await Usuario.create({
        userName: 'gabriel',
        password: hashedPassword,
        correoElectronico: 'gabriel@gmail.com',
        rol: 'admin',
        twoFactorEnabled: false
      });

      logger.info('Usuario administrador creado exitosamente');
    } else {
      logger.info('El usuario administrador ya existe');
    }
  } catch (error) {
    logger.error('Error al crear el usuario administrador:', error);
  }
};

module.exports = createAdminUser;