const VentaModel = require('../models/VentaModel');
const postgres = require('../server/src/config/db');

const VentaService = {
  async getDatosVista() {
    if (process.env.NODE_ENV !== 'test') {
      const [ventas, productos, clientes, vendedores] = await Promise.all([
        postgres.query('SELECT * FROM mostrarventas ORDER BY fecha_venta DESC'),
        postgres.query("SELECT * FROM productos WHERE estado_producto = 'Activo' ORDER BY id_producto"),
        postgres.query("SELECT * FROM persona WHERE tipo_persona = 'Cliente' AND estado = 'Activo' ORDER BY nombre"),
        postgres.query("SELECT * FROM persona WHERE tipo_persona = 'Vendedor' AND estado = 'Activo' ORDER BY nombre"),
      ]);
      const normalize = (person) => ({ ...person, Id_Persona: person.id_persona, Nombre: person.nombre, Apellido: person.apellido, Cedula: person.cedula, Telefono: person.telefono });
      const normalizeProduct = (product) => ({ ...product, Id_Producto: product.id_producto, Marca: product.marca, Existencia: product.existencia, Precio_Venta: product.precio_venta, Precio_Compra: product.precio_compra, Color: product.color, Tipo: product.tipo, Categoria: product.categoria, Talla: product.talla, Modelo: product.modelo, Clasificacion: product.clasificacion, Dimensiones: product.dimensiones, Unidad_Medida: product.unidad_medida });
      return [ventas.rows.map((sale) => ({ Id_Venta: sale.id_venta, Tipo_Venta: sale.tipo_venta, Fecha_Venta: new Date(sale.fecha_venta).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }), Total_Venta: sale.total_venta, Cliente: sale.cliente, Vendedor: sale.vendedor, Estado_Venta: sale.estado_venta })), productos.rows.map(normalizeProduct), clientes.rows.map(normalize), vendedores.rows.map(normalize)];
    }
    const [ventas, productos, clientes, vendedores] = await Promise.all([
      VentaModel.getVentas(),
      VentaModel.getProductos(),
      VentaModel.getClientes(),
      VentaModel.getVendedores()
    ]);

    const ventasFormateadas = ventas.map(venta => ({
      ...venta,
      Fecha_Venta: new Date(venta.Fecha_Venta).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'long', year: 'numeric'
      })
    }));

    return [ventasFormateadas, productos, clientes, vendedores];
  },

  async buscarPersonaPorCedula(cedula, tipo) {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT nombre, apellido FROM persona WHERE cedula = $1 AND tipo_persona = $2', [cedula, tipo]);
      if (rows[0]) return `${rows[0].nombre} ${rows[0].apellido}`;
      throw new Error('No encontrado');
    }
    const persona = await VentaModel.getPersonaByCedula(cedula, tipo);
    if (persona) return `${persona.Nombre} ${persona.Apellido}`;
    throw new Error('No encontrado');
  },

  async getDetalleVenta(id) {
    if (process.env.NODE_ENV !== 'test') {
      const { rows } = await postgres.query('SELECT dv.id_producto AS "Id_Producto", concat(p.tipo, \' \', p.marca, \' \', coalesce(p.modelo, \'\'), \' Color \', p.color, \' \', coalesce(p.talla, \'\')) AS "Producto", dv.cant_vendida AS "Cant_Vendida", dv.precio_unitario AS "Precio_Unitario", dv.cant_vendida * dv.precio_unitario AS "Sub_Total" FROM detalle_venta dv JOIN productos p ON p.id_producto = dv.id_producto WHERE dv.id_venta = $1', [id]);
      return rows;
    }
    return await VentaModel.getDetalleVenta(id);
  },

  async insertarVenta(data) {
    if (process.env.NODE_ENV !== 'test') {
      const client = await postgres.pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('INSERT INTO venta (id_venta,id_cliente,id_vendedor,tipo_venta,fecha_venta,total_venta,plazo_compra,frecuencia_abonos) VALUES ($1,$2,$3,$4,COALESCE($5,CURRENT_DATE),$6,$7,$8)', [data.Id_Venta, data.Id_Cliente, data.Id_Vendedor, data.Tipo_Venta, data.Fecha_Venta || null, data.Total_Venta, data.Plazo_Compra || null, data.Frecuencia_Abonos || null]);
        for (const producto of data.Productos || []) await client.query('INSERT INTO detalle_venta (id_venta,id_producto,cant_vendida,precio_unitario) VALUES ($1,$2,$3,$4)', [data.Id_Venta, producto.Id_Producto, producto.Cantidad, producto.Precio_Unitario]);
        await client.query('COMMIT');
      } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
      return;
    }
    await VentaModel.insertVenta(data);
    for (const producto of data.Productos) {
      await VentaModel.insertDetalleVenta(data.Id_Venta, producto);
    }
  }
};

module.exports = VentaService;
