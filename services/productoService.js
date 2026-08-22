const ProductoModel = require('../models/ProductoModel');
const postgres = require('../server/src/config/db');

const ProductoService = 
{

  async obtenerPorCategoria(categoria) 
  {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT *, concat_ws(\' \', categoria, tipo, marca, modelo, color, talla) AS "Descripcion" FROM productos WHERE categoria = $1 ORDER BY id_producto', [categoria]);
      return rows.map((product) => ({ ...product, Id_Producto: product.id_producto, Marca: product.marca, Existencia: product.existencia, Precio_Venta: product.precio_venta, Precio_Compra: product.precio_compra, Color: product.color, Tipo: product.tipo, Fecha_Ingreso: product.fecha_ingreso ? new Date(product.fecha_ingreso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }));
    }
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
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
      if (!rows.length) throw new Error('Producto no encontrado');
      return { ...rows[0], Id_Producto: rows[0].id_producto, Fecha_Ingreso: rows[0].fecha_ingreso ? new Date(rows[0].fecha_ingreso).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : '' };
    }
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
