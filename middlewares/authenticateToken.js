const jwt = require('jsonwebtoken');
const AppError = require('../errors/AppError');
const Usuario = require("../models/usuarios")
if (!process.env.JWT_SECRET) {
  throw new Error('La clave secreta para firmar el token no está definida');
}

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(403).json({ error: 'Usuario no encontrado' });
    }

    // Permitir acceso a /session para todos los usuarios autenticados
    if (req.url === '/session') {
      req.userData = { userId: decoded.id, rol: usuario.rol };
      return next();
    }

    // Resto de la lógica de autorización para otras rutas
    if (usuario.rol === 'admin') {
      req.userData = { userId: decoded.id, rol: 'admin' };
      next();
    } else if (usuario.rol === 'usuario') {
      if (req.url === '/recetas' || req.url === '/categorias' || req.url === '/ingredientes') {
        req.userData = { userId: decoded.id, rol: 'usuario' };
        next();
      } else {
        return res.status(403).json({ error: 'Usted no posee el rol necesario para realizar esa acción' });
      }
    } else {
      return res.status(403).json({ error: 'Usted no posee el rol necesario para realizar esa acción' });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

module.exports = authenticateToken;