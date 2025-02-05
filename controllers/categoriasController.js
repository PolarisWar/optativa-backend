const Categorias = require('../models/categorias');

const agregarCategoria = async (categoria_name, categoria_descripcion) => {
  if (!categoria_name || !categoria_descripcion) {
    throw new Error("Nombre y descripción son requeridos.");
  }
  return await Categorias.create({ categoria_name, categoria_descripcion });
};

const mostrarCategorias = async () => {
  return await Categorias.findAll();
};

async function deleteCategoria(categoriaId) {
  await Categorias.destroy({
    where: { id: categoriaId }
  });
}

async function updateCategoria(categoriaId, updatedData) {
  await Categorias.update(updatedData, {
    where: { id: categoriaId }
  });
}

const obtenerCategoriaPorId = async (categoriaId) => {
  const categoria = await Categorias.findByPk(categoriaId);
  if (!categoria) {
    throw new Error("Categoría no encontrada.");
  }
  return categoria;
};

module.exports = {
  agregarCategoria,
  mostrarCategorias,
  deleteCategoria,
  updateCategoria,
  obtenerCategoriaPorId
};