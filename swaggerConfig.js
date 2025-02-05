const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Recetas',
      version: '1.0.0',
      description: 'Documentación de la API de Recetas',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes.js', './helpers/controllers/*.js'], // Archivos donde están definidos los endpoints
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;