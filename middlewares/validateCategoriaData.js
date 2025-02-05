// middlewares/validateCategoriaData.js

const validateCategoriaData = (req, res, next) => {
    const { categoria_name, categoria_descripcion } = req.body;
    if (!categoria_name || !categoria_descripcion) {
      return res.status(400).json({ error: 'Nombre y descripción de la categoría son requeridos.' });
    }
    next();
  };
  
  module.exports = validateCategoriaData;