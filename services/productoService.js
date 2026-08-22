const ProductoModel = require('../models/ProductoModel');

const ProductoService = 
{

  async obtenerPorCategoria(categoria) 
  {
    const productos = await ProductoModel.findByCategoria(categoria);
    return productos.map(producto => {
      const fecha = new Date(producto.Fecha_Ingreso);
      producto.Fecha_Ingreso = fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      return producto;
    });
  },

  async buscarProducto(categoria, id) 
  {
    const productos = await ProductoModel.findById(categoria, id);
    const producto = productos[0];
    producto.Fecha_Ingreso = new Date(producto.Fecha_Ingreso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    return producto;
  },

  async agregar(data) 
  { await ProductoModel.insert(data); },

  async actualizar(data) 
  { await ProductoModel.update(data); }
  
};

module.exports = ProductoService;
