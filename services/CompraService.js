const CompraModel = require('../models/CompraModel');
const postgres = require('../server/src/config/db');

const CompraService = {
  async obtenerVistaCompras() {
    if (process.env.NODE_ENV !== 'test') {
      const [compras, productos, proveedores, gerentes] = await Promise.all([postgres.query('SELECT * FROM compras ORDER BY fecha_compra DESC'), postgres.query("SELECT * FROM productos WHERE estado_producto = 'Activo' ORDER BY id_producto"), postgres.query('SELECT * FROM mostrarproveedores ORDER BY nombre'), postgres.query("SELECT * FROM persona WHERE tipo_persona = 'Gerente' ORDER BY nombre")]);
      const normalizeProduct = (product) => ({ ...product, Id_Producto: product.id_producto, Marca: product.marca, Existencia: product.existencia, Precio_Venta: product.precio_venta, Precio_Compra: product.precio_compra, Color: product.color, Tipo: product.tipo, Categoria: product.categoria, Talla: product.talla, Modelo: product.modelo, Clasificacion: product.clasificacion, Dimensiones: product.dimensiones, Unidad_Medida: product.unidad_medida });
      const normalizePerson = (person) => ({ ...person, Id_Persona: person.id_persona, Nombre: person.nombre, Apellido: person.apellido, Cedula: person.cedula, Telefono: person.telefono, Comercio: person.comercio });
      return [compras.rows.map((purchase) => ({ ...purchase, Id_Compra: purchase.id_compra, Fecha_Compra: new Date(purchase.fecha_compra).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) })), productos.rows.map(normalizeProduct), proveedores.rows.map(normalizePerson), gerentes.rows.map(normalizePerson)];
    }
    const [compras, productos, proveedores, gerentes] = await Promise.all([
      CompraModel.getCompras(),
      CompraModel.getProductos(),
      CompraModel.getProveedores(),
      CompraModel.getGerentes()
    ]);

    const comprasFormateadas = compras.map(compra => ({
      ...compra,
      Fecha_Compra: new Date(compra.Fecha_Compra).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    }));

    return [comprasFormateadas, productos, proveedores, gerentes];
  },

  async insertarCompra(data) {
    if (process.env.NODE_ENV !== 'test') {
      const client = await postgres.pool.connect();
      try { await client.query('BEGIN'); const provider = await client.query("SELECT id_persona FROM persona WHERE cedula = $1 AND tipo_persona = 'Proveedor'", [data.Proveedor]); const buyer = await client.query("SELECT id_persona FROM persona WHERE cedula = $1 AND tipo_persona = 'Gerente'", [data.Comprador]); if (!provider.rows.length || !buyer.rows.length) throw new Error('Proveedor o comprador no encontrado'); await client.query('INSERT INTO compras (id_compra,id_proveedor,id_comprador,fecha_compra,total_compra) VALUES ($1,$2,$3,COALESCE($4,CURRENT_DATE),$5)', [data.Id_Compra, provider.rows[0].id_persona, buyer.rows[0].id_persona, data.Fecha_Compra || null, data.Total_compra]); for (const product of data.Productos || []) await client.query('INSERT INTO detalle_compra (id_compra,id_producto,cantidad_comprada,precio_compra,precio_venta) VALUES ($1,$2,$3,$4,$5)', [data.Id_Compra, product.IdProducto, product.Cantidad, product.Precio_Compra, product.Precio_Venta]); await client.query('COMMIT'); } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); } return;
    }
    await CompraModel.insertCompra(data);
    for (const producto of data.Productos) {
      await CompraModel.insertDetalleCompra(data.Id_Compra, producto);
    }
  },

  async buscarPersonaPorCedula(cedula, tipo) {
    return await CompraModel.getPersonaByCedula(cedula, tipo);
  },

  async obtenerDetalleCompra(id) {
    return await CompraModel.getDetalleCompra(id);
  },

  async obtenerInfoCompra(id) {
    return await CompraModel.getInfoCompra(id);
  }
};

module.exports = CompraService;
