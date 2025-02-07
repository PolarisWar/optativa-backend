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
const { obtenerUsuarioPorId, agregarUsuario } = require("./controllers/usuarioController");
const { hashPassword } = require("./helpers/hashPass");
const authenticateToken = require("./middlewares/authenticateToken");

// Rutas públicas (sin autenticación)
router.post("/auth/login", async (req, res, next) => {
  try {
    const { credentials, password } = req.body;

    if (!credentials || !password) {
      throw new AppError("Credentials and password are required", 400);
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

router.post("/auth/register", async (req, res, next) => {
  try {
    const { userName, correoElectronico, password, rol } = req.body;

    if (!userName || !correoElectronico || !password) {
      throw new AppError("All fields are required", 400);
    }

    const hashedPassword = await hashPassword(password);
    let usuario = await agregarUsuario(userName, hashedPassword, correoElectronico, rol);

    const userResponse = {
      id: usuario.id,
      userName: usuario.userName,
      correoElectronico: usuario.correoElectronico,
      rol: usuario.rol
    };

    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/refreshToken", async (req, res, next) => {
  try {
    const refreshTokenProvided = req.body.refreshToken;

    if (!refreshTokenProvided) {
      throw new AppError("No refresh token provided", 401);
    }

    const { accessToken, user } = await refreshToken(refreshTokenProvided);

    res.status(200).json({
      accessToken: accessToken,
      user,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError(
          "Refresh token expirado, por favor inicie sesión nuevamente",
          401
        )
      );
    }
    next(error);
  }
});

// Middleware de autenticación para las rutas protegidas
router.use(authenticateToken);

// Rutas protegidas (requieren autenticación)
router.get("/session", async (req, res, next) => {
  try {
    const sessionData = await obtenerUsuarioPorId(req.userData.userId);
    res.status(200).json(sessionData);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/logout", async (req, res, next) => {
  try {
    const result = await logout(req.userData.userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/2fa/generate", async (req, res, next) => {
  try {
    const { secret, qrCode } = await generateTwoFactorSecret(req.userData.id);
    res.json({ secret, qrCode });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/2fa/verify", async (req, res, next) => {
  try {
    const { code } = req.body;
    await verifyTwoFactorToken(req.userData.id, code);
    res.json({ message: "2FA activado exitosamente" });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/2fa/validate", async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await validateTwoFactorToken(req.userData.id, code);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
