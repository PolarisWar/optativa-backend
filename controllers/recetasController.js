const Recetas = require('../models/recetas');

const agregarReceta = async (receta_name, receta_descripcion, receta_instrucciones, tiempo_preparacion, categoriaId) => {
  if (!receta_name || !receta_descripcion || !receta_instrucciones || !tiempo_preparacion || !categoriaId) {
    throw new Error("Todos los campos son requeridos.");
  }
  return await Recetas.create({ receta_name, receta_descripcion, receta_instrucciones, tiempo_preparacion, categoriaId });
};

const mostrarRecetas = async () => {
  return await Recetas.findAll();
};

async function deleteReceta(recetaId) {
  await Recetas.destroy({
    where: { id: recetaId }
  });
}

async function updateReceta(recetaId, updatedData) {
  await Recetas.update(updatedData, {
    where: { id: recetaId }
  });
}

const obtenerRecetaPorId = async (recetaId) => {
  const receta = await Recetas.findByPk(recetaId);
  if (!receta) {
    throw new Error("Receta no encontrada.");
  }
  return receta;
};

module.exports = {
  agregarReceta,
  mostrarRecetas,
  deleteReceta,
  updateReceta,
  obtenerRecetaPorId
};