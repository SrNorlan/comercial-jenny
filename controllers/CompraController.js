const CompraService = require('../services/CompraService');

const CompraController = {
  async vistaCompras(req, res) {
    try {
      const [compras, productos, proveedores, gerentes] = await CompraService.obtenerVistaCompras();

      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('compras', {
        productos,
        compras,
        proveedores,
        gerentes,
        Mensaje: errorMessage,
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al cargar vista de compras:', error);
    }
  },

  async addCompra(req, res) {
    try {
      await CompraService.insertarCompra(req.body);
      res.status(200).json({ success: true, message: 'Compra agregada correctamente' });
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      res.status(500).json({ success: false, message: 'Hubo un error al agregar la Compra' });
    }
  },

  async buscarProveedor(req, res) {
    const cedula = req.query.cedula;
    try {
      const proveedor = await CompraService.buscarPersonaPorCedula(cedula, 'Proveedor');
      if (proveedor) {
        const nombre = `${proveedor.Nombre} ${proveedor.Apellido}`;
        res.json({ nombreProveedor: nombre, comercio: proveedor.Comercio });
      } else {
        res.json({ nombreProveedor: 'No se encontro al Proveedor' });
      }
    } catch (error) {
      console.error(error);
    }
  },

  async buscarGerente(req, res) {
    const cedula = req.query.cedula;
    try {
      const gerente = await CompraService.buscarPersonaPorCedula(cedula, 'Gerente');
      if (gerente) {
        const nombre = `${gerente.Nombre} ${gerente.Apellido}`;
        res.json({ nombreGerente: nombre });
      } else {
        res.json({ nombreGerente: 'No se encontro al Gerente' });
      }
    } catch (error) {
      console.error(error);
    }
  },

  async buscarDetalleCompra(req, res) {
    try {
      const detalles = await CompraService.obtenerDetalleCompra(req.query.id);
      res.json({ DetallesCompra: detalles });
    } catch (error) {
      console.error('Error al obtener detalle de compra:', error);
      res.status(500).json({ error: 'Error al buscar detalle' });
    }
  },

  async buscarCompra(req, res) {
    try {
      const info = await CompraService.obtenerInfoCompra(req.query.id);
      res.json({ Info: info });
    } catch (error) {
      console.error('Error al obtener info de compra:', error);
      res.status(500).json({ error: 'Error al buscar info' });
    }
  }
};

module.exports = CompraController;
