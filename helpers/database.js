const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

// importamos las variables de entorno para la conexión a la base de datos
const DB_NAME = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dialect = process.env.DB_DIALECT;
const host = process.env.HOST;


// conexión a la base de datos
const sequelize = new Sequelize(DB_NAME, user, password, {
    host: host,
    dialect: dialect,
    logging: false,
  });

  
// función para comprobar que salió bien la conexión con la base de datos
  sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");})
  .catch((err) => {
    console.log("Error al conectarse a la base de datos:");});
module.exports = sequelize;
