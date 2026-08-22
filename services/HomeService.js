const conexion = require('../config/db');
const postgres = require('../server/src/config/db');

const HomeService = 
{
  async cargarEstadisticas(user) 
  {
    if (process.env.NODE_ENV !== 'test') return cargarEstadisticasPostgres(user);
    const isGerente = user.Rol === 'Gerente';
    const Id_Persona = user.Id_Persona;

    await conexion.promise().query(`SET lc_time_names = 'es_ES';`);

    const [
      VentaContado,
      VentaCredito,
      Ingresos,
      ProductosAct,
      No_Clientes,
      Ventas,
      Egresos,
      Vendedores
    ] = await Promise.all([
      obtenerVentasContado(isGerente, Id_Persona),
      obtenerVentasCredito(isGerente, Id_Persona),
      obtenerIngresos(isGerente, Id_Persona),
      querySimple(`SELECT COUNT(Id_Producto) AS Total FROM productos WHERE Estado_Producto = 'Activo'`),
      querySimple(`SELECT COUNT(Id_Persona) AS Total FROM persona WHERE Tipo_Persona='Cliente' AND Estado='Activo'`),
      obtenerUltimasVentas(isGerente, Id_Persona),
      isGerente ? obtenerEgresos() : Promise.resolve([{ Egresos: null }]),
      querySimple(`SELECT * FROM Vendedores_mas_Ventas`)
    ]);

    return {
      VentaContado,
      VentaCredito,
      Ingresos: 'C$ ' + (Ingresos[0].Ingresos || 0),
      Productos: ProductosAct[0].Total,
      No_Clientes: No_Clientes[0].Total,
      Ventas,
      Egresos: Egresos[0]?.Egresos || 0,
      Vendedores
    };
  }
};

module.exports = HomeService;

async function cargarEstadisticasPostgres(user) {
  const isGerente = user.Rol === 'Gerente';
  const sellerFilter = isGerente ? '' : ' AND v.id_vendedor = $1';
  const sellerParams = isGerente ? [] : [user.Id_Persona];
  const [cash, credit, income, products, clients, sales, expenses, sellers] = await Promise.all([
    postgres.query(`SELECT to_char(date_trunc('month', v.fecha_venta), 'YYYY-MM') AS "Mes", SUM(v.total_venta) AS "Total_Ventas" FROM venta v WHERE v.fecha_venta >= date_trunc('month', CURRENT_DATE) - INTERVAL '4 months' AND v.tipo_venta = 'Contado'${sellerFilter} GROUP BY date_trunc('month', v.fecha_venta) ORDER BY date_trunc('month', v.fecha_venta)`, sellerParams),
    postgres.query(`SELECT to_char(date_trunc('month', v.fecha_venta), 'YYYY-MM') AS "Mes", SUM(a.monto_abonado) AS "IngresoTotal" FROM venta v JOIN abonos a ON a.id_venta = v.id_venta WHERE v.fecha_venta >= date_trunc('month', CURRENT_DATE) - INTERVAL '4 months' AND v.tipo_venta = 'Credito'${sellerFilter} GROUP BY date_trunc('month', v.fecha_venta) ORDER BY date_trunc('month', v.fecha_venta)`, sellerParams),
    postgres.query(`SELECT (SELECT COALESCE(SUM(total_venta), 0) FROM venta WHERE tipo_venta = 'Contado' AND fecha_venta >= date_trunc('month', CURRENT_DATE)${isGerente ? '' : ' AND id_vendedor = $1'}) + (SELECT COALESCE(SUM(a.monto_abonado), 0) FROM abonos a JOIN venta v ON v.id_venta = a.id_venta WHERE a.fecha_abono >= date_trunc('month', CURRENT_DATE)${isGerente ? '' : ' AND v.id_vendedor = $1'}) AS "Ingresos"`, sellerParams),
    postgres.query("SELECT COUNT(*)::int AS \"Total\" FROM productos WHERE estado_producto = 'Activo'"),
    postgres.query("SELECT COUNT(*)::int AS \"Total\" FROM persona WHERE tipo_persona = 'Cliente' AND estado = 'Activo'"),
    postgres.query(`SELECT v.tipo_venta AS "Tipo_Venta", v.fecha_venta AS "Fecha_Venta", v.total_venta AS "Total_Venta", concat(c.nombre, ' ', c.apellido) AS "Cliente", concat(e.nombre, ' ', e.apellido) AS "Vendedor" FROM venta v JOIN persona c ON c.id_persona = v.id_cliente JOIN persona e ON e.id_persona = v.id_vendedor WHERE v.fecha_venta >= date_trunc('month', CURRENT_DATE)${sellerFilter} ORDER BY v.fecha_venta DESC LIMIT 5`, sellerParams),
    isGerente ? postgres.query("SELECT COALESCE(SUM(total_compra), 0) AS \"Egresos\" FROM compras WHERE fecha_compra >= date_trunc('month', CURRENT_DATE)") : Promise.resolve({ rows: [{ Egresos: 0 }] }),
    postgres.query(`SELECT e.id_persona AS "Id_Persona", concat(e.nombre, ' ', e.apellido) AS "Nombre", COUNT(v.id_venta)::int AS "Cant_ventas", COALESCE(SUM(v.total_venta), 0) AS "Total_Vendido" FROM persona e LEFT JOIN venta v ON v.id_vendedor = e.id_persona AND v.fecha_venta >= date_trunc('month', CURRENT_DATE) WHERE e.tipo_persona = 'Vendedor' GROUP BY e.id_persona, e.nombre, e.apellido ORDER BY "Total_Vendido" DESC`),
  ]);
  return {
    VentaContado: cash.rows,
    VentaCredito: credit.rows,
    Ingresos: 'C$ ' + (income.rows[0].Ingresos || 0),
    Productos: products.rows[0].Total,
    No_Clientes: clients.rows[0].Total,
    Ventas: sales.rows.map((sale) => ({ ...sale, Fecha_Venta: new Date(sale.Fecha_Venta).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) })),
    Egresos: expenses.rows[0]?.Egresos || 0,
    Vendedores: sellers.rows,
  };
}

// -----------------------------------------
// Funciones auxiliares internas del módulo
// -----------------------------------------

async function querySimple(query) {
  const [rows] = await conexion.promise().query(query);
  return rows;
}

async function obtenerVentasContado(isGerente, idVendedor) {
  const query = isGerente
    ? `SELECT * FROM ventasContxmes;`
    : `
      SELECT
        v.Id_Vendedor,
        DATE_FORMAT(v.Fecha_Venta, '%M %Y') AS 'Mes',
        SUM(v.Total_Venta) AS Total_Ventas
      FROM venta v
      WHERE v.Fecha_Venta >= DATE_FORMAT(CURDATE() - INTERVAL 4 month, '%Y-%m-01')
        AND v.Tipo_Venta = 'Contado'
        AND v.Id_Vendedor = ${idVendedor}
      GROUP BY DATE_FORMAT(v.Fecha_Venta, '%Y-%m')
      ORDER BY v.Fecha_Venta
    `;
  return querySimple(query);
}

async function obtenerVentasCredito(isGerente, idVendedor) {
  const query = isGerente
    ? `SELECT * FROM ventasCredxmes;`
    : `
      SELECT
        v.Id_Vendedor,
        DATE_FORMAT(v.Fecha_Venta, '%M %Y') AS 'Mes',
        SUM(a.Monto_Abonado) AS 'IngresoTotal'
      FROM venta v
      INNER JOIN abonos a ON a.Id_Venta = v.Id_Venta
      WHERE v.Fecha_Venta >= DATE_FORMAT(CURDATE() - INTERVAL 4 month, '%Y-%m-01')
        AND v.Tipo_Venta = 'Credito'
        AND v.Id_Vendedor = ${idVendedor}
      GROUP BY DATE_FORMAT(v.Fecha_Venta, '%Y-%m')
      ORDER BY v.Fecha_Venta
    `;
  return querySimple(query);
}

async function obtenerIngresos(isGerente, idVendedor) {
  const [results] = await conexion.promise().query(
    isGerente
      ? `CALL IngresosVentasMensuales();`
      : `CALL IngresosVentasMensualesVendedor(${idVendedor});`
  );
  return results[0];
}

async function obtenerUltimasVentas(isGerente, idVendedor) {
  const query = `
    SELECT 
      v.Tipo_Venta, 
      v.Fecha_Venta, 
      v.Total_Venta, 
      CONCAT(c.Nombre,' ',c.Apellido) AS Cliente, 
      CONCAT(vdr.Nombre,' ',vdr.Apellido) AS Vendedor
    FROM Venta v
    JOIN Persona c ON v.Id_Cliente = c.Id_Persona
    JOIN Persona vdr ON v.Id_Vendedor = vdr.Id_Persona
    WHERE MONTH(v.Fecha_Venta) = MONTH(CURDATE()) 
      AND YEAR(v.Fecha_Venta) = YEAR(CURDATE())
      ${!isGerente ? `AND v.Id_Vendedor = ${idVendedor}` : ''}
    ORDER BY v.Fecha_Venta DESC
    LIMIT 5
  `;
  const rows = await querySimple(query);
  return rows.map(venta => ({
    ...venta,
    Fecha_Venta: new Date(venta.Fecha_Venta).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }));
}

async function obtenerEgresos() 
{
  const query = `
    SELECT SUM(Total_Compra) AS Egresos FROM Compras
    WHERE MONTH(Fecha_Compra) = MONTH(CURDATE()) AND
          YEAR(Fecha_Compra) = YEAR(CURDATE())
  `;
  return querySimple(query);
}
