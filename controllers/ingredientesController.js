const Ingredientes = require('../models/ingredientes');

const agregarIngrediente = async (ingredientes_name, unidad_medida, recetaId) => {
  try {
    if (!ingredientes_name || !unidad_medida || !recetaId) {
      throw new Error("Nombre, unidad de medida y recetaId son requeridos.");
    }
    return await Ingredientes.create({ ingredientes_name, unidad_medida, recetaId });
  } catch (error) {
    throw new Error(error.message);
  }
};

const mostrarIngredientes = async () => {
  try {
    return await Ingredientes.findAll();
  } catch (error) {
    throw new Error('Error al mostrar ingredientes');
  }
};

async function deleteIngrediente(ingredienteId) {
  try {
    await Ingredientes.destroy({
      where: { id: ingredienteId }
    });
  } catch (error) {
    throw new Error('Error al eliminar ingrediente');
  }
}

async function updateIngrediente(ingredienteId, updatedData) {
  try {
    await Ingredientes.update(updatedData, {
      where: { id: ingredienteId }
    });
  } catch (error) {
    throw new Error('Error al actualizar ingrediente');
  }
}

const obtenerIngredientePorId = async (ingredienteId) => {
  try {
    const ingrediente = await Ingredientes.findByPk(ingredienteId);
    if (!ingrediente) {
      throw new Error("Ingrediente no encontrado.");
    }
    return ingrediente;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  agregarIngrediente,
  mostrarIngredientes,
  deleteIngrediente,
  updateIngrediente,
  obtenerIngredientePorId
};
