const Usuario = require('../models/usuarios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/hashPass');
const { Op } = require('sequelize');

const agregarUsuario = async (userName, password, correoElectronico, rol) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({
      where: {
        [Op.or]: [
          { userName: userName },
          { correoElectronico: correoElectronico }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.userName === userName) {
        throw new Error('El nombre de usuario ya está en uso');
      }
      if (existingUser.correoElectronico === correoElectronico) {
        throw new Error('El correo electrónico ya está registrado');
      }
    }

    // Crear el nuevo usuario con la contraseña ya hasheada
    const nuevoUsuario = await Usuario.create({
      userName,
      password, // password ya viene hasheada desde la ruta
      correoElectronico,
      rol,
    });

    // Retornar usuario sin la contraseña
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    return usuarioSinPassword;
  } catch (error) {
    throw error;
  }
};

const mostrarUsuarios = async () => {
  const usuarios = await Usuario.findAll();
  return usuarios;
};

const eliminarUsuario = async (id) => {
  await Usuario.destroy({
    where: { id },
  });
  return { message: 'Usuario eliminado' };
};

const actualizarUsuario = async (id, updatedData) => {
  await Usuario.update(updatedData, {
    where: { id },
  });
  return { message: 'Usuario actualizado' };
};

const obtenerUsuarioPorId = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  return usuario;
};

const generarToken = async (usuario) => {
  try {
    const token = jwt.sign({ id: usuario.id, userName: usuario.userName }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  } catch (error) {
    throw error;
  }
};

const generarRefreshToken = async (usuario) => {
  try {
    const refreshToken = jwt.sign({ id: usuario.id, userName: usuario.userName }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    return refreshToken;
  } catch (error) {
    throw error;
  }
};

const iniciarSesion = async (userName, password) => {
  try {
    const usuario = await Usuario.findOne({
      where: { userName },
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const isValidPassword = await comparePassword(password, usuario.password);


    if (!isValidPassword) {
      throw new Error('Contraseña incorrecta');
    }

    const token = await generarToken(usuario);
    const refreshToken = await generarRefreshToken(usuario);

    return { token, refreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  agregarUsuario,
  mostrarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  iniciarSesion,
};
