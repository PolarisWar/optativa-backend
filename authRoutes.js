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





router.post("/auth/login", async (req, res, next) => {
  try {
    console.log(req.body)
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

router.post("/auth/register", async (req, res, next) => {
  try {
    try {
      const { username, email, password, rol } = req.body;
      //aqui son los datos de tu modelo 

      if (
        !username ||
        !email ||
        !password

      ) {
        throw new AppError("All fields are required", 400);
      }

      const hashedPassword = await hashPassword(password);
      let user = await agregarUsuario(username, email, hashedPassword, rol);



      res.status(201).json(user);
    } catch (error) {

      next(error);

    }
  } catch (error) {
    next(error);
  }
});

router.use(authenticateToken);


router.get(
  "/session",

  async (req, res, next) => {
    try {
      console.log(req.userData)
      const sessionData = await obtenerUsuarioPorId(req.userData.userId);
      res.status(200).json(sessionData);
    } catch (error) {
      next(error);
    }

  }
);



router.post(
  "/auth/logout",
  authenticateToken,
  async (req, res, next) => {
    try {
      const result = await logout(req.userData.userId);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);





router.post(
  "/auth/2fa/generate",

  async (req, res, next) => {
    try {

      const { secret, qrCode } = await generateTwoFactorSecret(
        req.userData.id
      );
      res.json({ secret, qrCode });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/auth/2fa/verify",

  async (req, res, next) => {
    try {
      const { code } = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new AppError("Token must me provide", 401));
      }
      const token = authHeader.split(" ")[1];

      await verifyTwoFactorToken(req.userData.id, code);

      res.json({ message: "2FA activado exitosamente" });
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/auth/2fa/validate",

  async (req, res, next) => {
    try {
      const { code } = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next(new AppError("Token debe ser proporcionado", 401));
      }
      const token = authHeader.split(" ")[1];

      const result = await validateTwoFactorToken(
        req.userData.id,
        code
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
