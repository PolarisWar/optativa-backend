// middlewares/validateRecetaData.js

const validateRecetaData = (req, res, next) => {
    const { receta_name, receta_descripcion, receta_instrucciones, tiempo_preparacion, categoriaId } = req.body;
    if (!receta_name || !receta_descripcion || !receta_instrucciones || !tiempo_preparacion || !categoriaId) {
      return res.status(400).json({ error: 'Todos los campos de la receta son requeridos.' });
    }
    next();
  };
  
  module.exports = validateRecetaData;