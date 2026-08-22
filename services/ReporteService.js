// src/services/ReporteService.js
const conexion = require('../config/db');

class ReporteService {
  static obtenerReporteVentas(rango, fechaInicio, fechaFin) {
    return Promise.all([
      this.ejecutarConsulta('CALL ReporteIngresosContado(?,?,?)', [rango, fechaInicio, fechaFin]),
      this.ejecutarConsulta('CALL ReporteIngresosCredito(?,?,?)', [rango, fechaInicio, fechaFin]),
      this.ejecutarConsulta('CALL ReporteIngresos(?,?,?)', [rango, fechaInicio, fechaFin]),
    ]);
  }

  static obtenerReporteCompras(rango, fechaInicio, fechaFin) {
    return this.ejecutarConsulta('CALL ReporteCompras(?,?,?)', [rango, fechaInicio, fechaFin]);
  }

  static obtenerReporteVendedor(rango, fechaInicio, fechaFin, id) {
    return Promise.all([
      this.ejecutarConsulta('CALL ReporteIngresosContadoVendedor(?,?,?,?)', [rango, fechaInicio, fechaFin, id]),
      this.ejecutarConsulta('CALL ReporteIngresosCreditoVendedor(?,?,?,?)', [rango, fechaInicio, fechaFin, id]),
      this.ejecutarConsulta('CALL ReporteIngresosVendedor(?,?,?,?)', [rango, fechaInicio, fechaFin, id]),
    ]);
  }

  static obtenerReporteMorosos() {
    return this.ejecutarConsulta('SELECT * FROM showdeudores');
  }

  static ejecutarConsulta(sql, params = []) {
    return new Promise((resolve, reject) => {
      conexion.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}

module.exports = ReporteService;
