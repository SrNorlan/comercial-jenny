const conexion = require('../config/db');

const ProductoModel = 
{
  async findByCategoria(categoria) 
  {
    const [results] = await conexion.promise().query('CALL MostrarProductos(?)', [categoria]);
    return results[0];
  },

  async findById(categoria, id) 
  {
    const [results] = await conexion.promise().query('CALL BuscarProducto(?, ?)', [categoria, id]);
    return results[0];
  },

  async insert(data) 
  {
    const { Marca, Color, Tipo, Categoria_Prod, Talla, Modelo, Clasificacion, Dimensiones, Unidad_Medida, Fecha_Vencimiento } = data;

    const params = [
      Marca.toUpperCase(),
      Color.toUpperCase(),
      Tipo.toUpperCase(),
      Categoria_Prod,
      Talla.toUpperCase(),
      Modelo.toUpperCase(),
      Clasificacion.toUpperCase(),
      Dimensiones.toUpperCase(),
      Unidad_Medida.toUpperCase(),
      Fecha_Vencimiento
    ];

    await conexion.promise().query('CALL AddProducto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params);
  },

  async update(data) 
  {
    const { Id_Prod, Marca, Color, Tipo, Talla, Modelo, Clasificacion, Dimensiones, Unidad_Medida, Fecha_Vencimiento } = data;

    const params = [
      Id_Prod,
      Marca.toUpperCase(),
      Color.toUpperCase(),
      Tipo.toUpperCase(),
      Talla.toUpperCase(),
      Modelo.toUpperCase(),
      Clasificacion.toUpperCase(),
      Dimensiones.toUpperCase(),
      Unidad_Medida.toUpperCase(),
      Fecha_Vencimiento
    ];

    await conexion.promise().query('CALL update_producto(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', params);
  }
};

module.exports = ProductoModel;
