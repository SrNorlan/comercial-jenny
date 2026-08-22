// src/controllers/ReporteController.js
const moment = require('moment');
require('moment/locale/es');
const ReporteService = require('../services/ReporteService');
const {
  buildReporteVentas,
  buildReporteCompras,
  buildReporteVendedor,
  buildReporteMorosos
} = require('../pdf/ReportePDFBuilder');

const formatearPeriodo = (rango, datos) => {
  moment.locale('es');
  let titulo = '';
  const fechaInicio = moment(datos.FechaInicio).format('DD [de] MMMM [del] YYYY');
  const fechaFin = moment(datos.FechaFin).format('DD [de] MMMM [del] YYYY');

  if (rango === 'semana') titulo = `Semana del ${fechaInicio} al ${fechaFin}`;
  else if (rango === 'quincena') titulo = `Quincena del ${fechaInicio} al ${fechaFin}`;
  else if (rango === 'rango') titulo = `del ${fechaInicio} al ${fechaFin}`;

  return titulo;
};

const ReporteController = {
  async generarReporteVentas(req, res) {
    try {
      const { period, fecha_inicio, fecha_fin, 'mes-select': mes } = req.body;
      let fechaInicio = fecha_inicio;
      if (period === 'mes') {
        const [year, month] = mes.split('-');
        fechaInicio = `${year}-${month}-01`;
      }

      const [contado, credito, total] = await ReporteService.obtenerReporteVentas(period, fechaInicio, fecha_fin);
      const datos = [{
        Titulo: formatearPeriodo(period, credito[0][0] || {}),
        FechaInicio: credito[0][0]?.FechaInicio,
        FechaFin: credito[0][0]?.FechaFin,
      }, contado[0], credito[1], total[0]];

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Reporte_Ventas_${datos[0].Titulo}.pdf`,
      });

      buildReporteVentas(data => stream.write(data), () => stream.end(), datos);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error generando reporte');
    }
  },

  async generarReporteCompras(req, res) {
    try {
      const { period, fecha_inicio, fecha_fin, 'mes-select': mes } = req.body;
      let fechaInicio = fecha_inicio;
      if (period === 'mes') {
        const [year, month] = mes.split('-');
        fechaInicio = `${year}-${month}-01`;
      }

      const results = await ReporteService.obtenerReporteCompras(period, fechaInicio, fecha_fin);
      const datos = [{
        Titulo: formatearPeriodo(period, results[0][0]),
        FechaInicio: results[0][0].FechaInicio,
        FechaFin: results[0][0].FechaFin,
      }, results[1]];

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Reporte_Compras_${datos[0].Titulo}.pdf`,
      });

      buildReporteCompras(data => stream.write(data), () => stream.end(), datos);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error generando reporte');
    }
  },

  async generarReporteVendedor(req, res) {
    try {
      const { period, fecha_inicio, fecha_fin, 'mes-select': mes, select_vendedor, vendedor_name } = req.body;
      let fechaInicio = fecha_inicio;
      if (period === 'mes') {
        const [year, month] = mes.split('-');
        fechaInicio = `${year}-${month}-01`;
      }

      const [contado, credito, total] = await ReporteService.obtenerReporteVendedor(period, fechaInicio, fecha_fin, select_vendedor);
      const datos = [{
        Titulo: formatearPeriodo(period, credito[0][0]),
        FechaInicio: credito[0][0]?.FechaInicio,
        FechaFin: credito[0][0]?.FechaFin,
        Vendedor: vendedor_name
      }, contado[0], credito[1], total[0]];

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Reporte_Vendedor_${vendedor_name}.pdf`,
      });

      buildReporteVendedor(data => stream.write(data), () => stream.end(), datos);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error generando reporte');
    }
  },

  async generarReporteMorosos(req, res) {
    try {
      const fecha = new Date();
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const datosFecha = {
        FechaInicio: `${year}-${month}-01`,
        FechaFin: `${year}-${month}-30`
      };

      const morosos = await ReporteService.obtenerReporteMorosos();

      const datos = [{
        Titulo: `del Mes de ${moment().locale('es').format('MMMM [de] YYYY')}`,
      }, morosos];

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Reporte_Clientes_Deuda.pdf`,
      });

      buildReporteMorosos(data => stream.write(data), () => stream.end(), datos);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error generando reporte');
    }
  }
};

module.exports = ReporteController;
