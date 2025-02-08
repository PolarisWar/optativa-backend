const AppError = require("./errors/AppError");
const router = require("express").Router();
const {
  login,
  refreshToken,
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  validateTwoFactorToken,
  logout,
} = require("./controllers/authController");
const { agregarUsuario, obtenerUsuarioPorId } = require("./controllers/usuarioController");
const { hashPassword } = require("./helpers/hashPass");
const authenticateToken = require("./middlewares/authenticateToken");

//---------------------//
//   Rutas Públicas    //
//---------------------//

// Login
router.post("/auth/login", async (req, res, next) => {
  try {
    const { credentials, password } = req.body;

    if (!credentials || !password) {
      throw new AppError("Credenciales y contraseña son requeridos", 400);
    }

    const { accessToken, refreshToken } = await login(credentials, password);
    
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// Registro
router.post("/auth/register", async (req, res, next) => {
  try {
    const { userName, correoElectronico, password } = req.body;

    // Validaciones
    if (!userName || !correoElectronico || !password) {
      throw new AppError("Todos los campos son requeridos", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico)) {
      throw new AppError("Formato de correo inválido", 400);
    }

    if (password.length < 6) {
      throw new AppError("La contraseña debe tener al menos 6 caracteres", 400);
    }

    const hashedPassword = await hashPassword(password);
    const usuario = await agregarUsuario(
      userName,
      hashedPassword,
      correoElectronico,
      'usuario'
    );

    res.status(201).json({
      success: true,
      message: "Registro exitoso",
      user: {
        id: usuario.id,
        userName: usuario.userName,
        correoElectronico: usuario.correoElectronico,
        rol: usuario.rol
      }
    });

  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const message = error.fields?.userName 
        ? "Nombre de usuario en uso" 
        : "Correo electrónico registrado";
      return next(new AppError(message, 400));
    }
    next(error);
  }
});

// Refresh Token
router.post("/auth/refreshToken", async (req, res, next) => {
  try {
    const { refreshToken: refreshTokenProvided } = req.body;
    
    if (!refreshTokenProvided) {
      throw new AppError("Refresh token requerido", 401);
    }

    const { accessToken } = await refreshToken(refreshTokenProvided);
    
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
});

//-----------------------------//
//   Rutas Protegidas (JWT)    //
//-----------------------------//
router.use(authenticateToken);

// Obtener sesión del usuario
router.get("/session", async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.userData.userId);
    if (!usuario) {
      throw new AppError("Usuario no encontrado", 404);
    }
    
    // Eliminamos datos sensibles
    const { password, ...userWithoutPassword } = usuario.toJSON();
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// Logout
router.post("/auth/logout", async (req, res, next) => {
  try {
    const result = await logout(req.userData.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//-----------------------------//
//   Rutas de 2-Factor Auth    //
//-----------------------------//

// Generar secreto 2FA
router.post("/auth/2fa/generate", async (req, res, next) => {
  try {
    const { secret, qrCode } = await generateTwoFactorSecret(req.userData.userId);
    res.json({ secret, qrCode });
  } catch (error) {
    next(error);
  }
});

// Verificar código 2FA (activación)
router.post("/auth/2fa/verify", async (req, res, next) => {
  try {
    const { code } = req.body;
    await verifyTwoFactorToken(req.userData.userId, code);
    res.json({ success: true, message: "2FA activado exitosamente" });
  } catch (error) {
    next(error);
  }
});

// Validar código 2FA (login)
router.post("/auth/2fa/validate", async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await validateTwoFactorToken(req.userData.userId, code);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;