const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const { comparePassword } = require("../helpers/hashPass");
const AppError = require("../errors/AppError");
const Users = require("../models/usuarios");

const generateTwoFactorSecret = async (userId) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  const secret = speakeasy.generateSecret({
    name: `Recetas:${user.userName}`,
    length: 20,
  });

  // Actualizar usuario con el nuevo secreto
  await user.update({ twoFactorSecret: secret.base32 });

  // Generar QR
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode: qrCodeUrl,
  };
};

const verifyTwoFactorToken = async (userID, code) => {
  const user = await Users.findByPk(userID);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const secret = user.twoFactorSecret;

  const isValid = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: code,
  });
  if (!isValid) {
    throw new AppError("Código inválido", 401);
  }
  await Users.update(
    { ...user, twoFactorEnabled: true },
    { where: { id: userID } }
  );
};

const login = async (credentials, password) => {
  const user = await Users.findOne({
    where: {
      [Op.or]: [{ userName: credentials }, { correoElectronico: credentials }],
    },
  });

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const payload = {
    id: user.id,
    userName: user.userName,
    email: user.correoElectronico,
    rol: user.rol
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (refreshTokenProvided) => {
  const decoded = jwt.verify(
    refreshTokenProvided,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await Users.findOne({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  // Generar nuevo access token
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    accessToken: newAccessToken,
  };
};

const validateTwoFactorToken = async (userId, code) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (!user.twoFactorEnabled) {
    throw new AppError("2FA no está activado para este usuario", 400);
  }

  const isValid = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
  });

  if (!isValid) {
    throw new AppError("Código inválido", 401);
  }

  return { success: true };
};

const logout = async (userId) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    throw new AppError("Usuario no encontrado", 404);
  }
  
  // Aquí podrías implementar lógica adicional como invalidar tokens
  // Por ahora simplemente confirmamos el logout exitoso
  return {
    success: true,
    message: "Sesión cerrada exitosamente"
  };
};

module.exports = {
  login,
  refreshToken,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  validateTwoFactorToken,
  logout,
};
