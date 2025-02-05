// middlewares/validateIngredienteData.js

const validateIngredienteData = (req, res, next) => {
    const { ingredientes_name, unidad_medida, recetaId } = req.body;
    if (!ingredientes_name || !unidad_medida || !recetaId) {
      return res.status(400).json({ error: 'Nombre, unidad de medida y recetaId son requeridos.' });
    }
    next();
  };
  
  module.exports = validateIngredienteData;