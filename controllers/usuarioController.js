const bcrypt = require('bcrypt');
const Usuario = require('../models/usuarios');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const agregarUsuario = async (userName, password, correoElectronico, rol) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await Usuario.create({
      userName,
      password: hash,
      correoElectronico,
      rol,
    });

    return nuevoUsuario;
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

    const isValidPassword = await bcrypt.compare(password, usuario.password);

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