const logger = require('../logger/logger');
const AppError = require('../errors/AppError');

async function errorHandler(err, req, res, next) {

  // Si el error es una instancia de AppError, usa su mensaje y código de estado
  try {

  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`);
    return res.status(err.statusCode).json({ error: err.message });
  }

  } catch (error) {
    logger.error('Error inesperado: ', error);
    res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.' });
    return;
  }

  logger.error('Error inesperado: ', err);
  res.status(500).json({ error: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.' });
}

module.exports = errorHandler;
