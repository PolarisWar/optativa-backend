require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const routes = require('./routes'); // Importa el archivo de rutas
const authRoutes = require('./authRoutes.js'); // Importa el archivo de rutas
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig'); // Importa la configuración de Swagger
const logger = require('./logger/logger');
const errorHandler = require('./middlewares/errorHandler');


const corsOptions = {
  origin: '*', // Permitir todas las solicitudes de origen
  methods: 'GET,PUT,POST,DELETE', // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

app.use(cors(corsOptions));
app.use(express.json((err, req, res, next) => {
  console.log(err);
  next();
})); // Corrige el uso de express.json()
app.use((req, res, next) => {
  logger.info(`Solicitud entrante: ${req.method} ${req.url}`);
  next();
});
app.use('/', authRoutes); // Usa las rutas importadas
app.use('/', routes); // Usa las rutas importadas
app.use(errorHandler);

// Configura Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3001, () => {
  logger.info('Servidor iniciado en el puerto 3001');
});

// Instancia de Sequelize para conectarse a la base de datos
const sequelize = require("./helpers/database.js");


// Sincronizar los modelos para verificar la conexión con la base de datos
sequelize
  .sync({ alter: true })
  .then(() => {
    logger.info("Todos los modelos se sincronizaron correctamente.");
  })
  .catch((err) => {
    logger.error("Ha ocurrido un error al sincronizar los modelos: ", err);
  });
