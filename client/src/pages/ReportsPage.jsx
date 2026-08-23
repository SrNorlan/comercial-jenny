import React from 'react';
import { money } from '../api/client';

export default function ReportsPage({ summary }) {
  return <section className="module-view"><div className="module-toolbar"><div><p className="eyebrow">ANALÍTICA</p><h2>Centro de reportes</h2></div><span className="status-dot">● Datos en tiempo real</span></div><div className="report-grid"><article><span>Ventas del mes</span><strong>{money(summary?.sales?.amount)}</strong><small>{summary?.sales?.total || 0} transacciones</small></article><article><span>Cuentas por cobrar</span><strong>{money(summary?.credit?.outstanding)}</strong><small>Saldo pendiente</small></article><article><span>Unidades en inventario</span><strong>{summary?.products?.stock || 0}</strong><small>{summary?.products?.total || 0} productos</small></article><article><span>Clientes registrados</span><strong>{summary?.clients?.total || 0}</strong><small>Base de clientes</small></article></div></section>;
}
