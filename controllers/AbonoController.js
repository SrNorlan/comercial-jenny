const AbonoService = require('../services/AbonoService');

const AbonoController = {
  async vistaAbonos(req, res) {
    try {
      const ventasCredito = await AbonoService.obtenerVentasCredito();
      const errorMessage = req.cookies.errorMessage;
      res.clearCookie('errorMessage');

      res.render('abonos', {
        Ventas_Credito: ventasCredito,
        Mensaje: errorMessage,
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al cargar abonos:', error);
    }
  },

  async agregarAbono(req, res) 
  {
    const { Id_Venta_Abono, Monto_Abono, Fecha_Abono } = req.body;

    try {
      await AbonoService.agregar({
        Id_Venta: Id_Venta_Abono,
        Monto: Monto_Abono,
        Fecha: Fecha_Abono
      });

      const ventasCredito = await AbonoService.obtenerVentasCredito();

      res.render('abonos', {
        Ventas_Credito: ventasCredito,
        alert: true,
        alertTitle: 'Abono Agregado',
        alertMessage: `El abono a la venta N° ${Id_Venta_Abono} ha sido agregado correctamente`,
        alertIcon: 'success',
        showConfirmButton: true,
        timer: false,
        ruta: 'abonos',
        UserRol: req.user.Rol
      });
    } catch (error) {
      console.error('Error al agregar abono:', error);

      const ventasCredito = await AbonoService.obtenerVentasCredito();

      res.render('abonos', {
        Ventas_Credito: ventasCredito,
        alert: true,
        alertTitle: 'No se pudo completar la operación',
        alertMessage: `No se pudo agregar el abono a la venta N° ${Id_Venta_Abono}, compruebe los datos e intente nuevamente`,
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: 'abonos',
        UserRol: req.user.Rol
      });
    }
  },
  
  async buscarAbonosPorVenta(req, res) 
  {
    const id = req.query.id;
    try 
    {
      const abonos = await AbonoService.buscarPorVenta(id);
      res.json({ Abonos: abonos });
    } catch (error) {
      console.error(`Error al buscar abonos de la venta N° ${id}:`, error);
      res.status(500).json({ error: 'Error al obtener abonos.' });
    }
  }
  
};

module.exports = AbonoController;
