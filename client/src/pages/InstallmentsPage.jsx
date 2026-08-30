import React, { useState } from 'react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { api, money, pick } from '../api/client';

export default function InstallmentsPage({ installments, onPayment }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setConfirmOpen(true);
  }
  async function savePayment() {
    try {
      await api('/installments', {
        method: 'POST',
        body: JSON.stringify({ idVenta: selected.id_venta, montoAbonado: Number(amount) }),
      });
      setSelected(null);
      setAmount('');
      onPayment();
    } catch (error) {
      setMessage(error.message);
    }
  }
  return (
    <section className="module-view">
      <div className="module-toolbar">
        <div>
          <p className="eyebrow">CUENTAS POR COBRAR</p>
          <h2>Abonos pendientes</h2>
        </div>
        <span className="status-dot">● {installments.length} créditos abiertos</span>
      </div>
      <div className="client-list">
        {installments.map((credit, index) => (
          <article className="client-row" key={credit.id_venta || index}>
            <span className="client-avatar">$</span>
            <div>
              <strong>{pick(credit, ['nombre_cliente', 'cliente', 'nombre'], 'Cliente')}</strong>
              <small>
                Venta #{credit.id_venta} · {credit.fecha_venta || 'Sin fecha'}
              </small>
            </div>
            <span className="client-credit">
              {money(pick(credit, ['saldo_restante', 'saldo'], 0))}
              <small>Saldo pendiente</small>
            </span>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setSelected(credit);
                setAmount(pick(credit, ['saldo_restante', 'saldo'], ''));
              }}
            >
              Registrar abono
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <div className="form-modal-backdrop">
          <form className="payment-box form-modal" onSubmit={submit}>
          <strong>Abono para venta #{selected.id_venta}</strong>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
          <button type="submit">Confirmar abono</button>
          <button type="button" className="text-button" onClick={() => setSelected(null)}>
            Cancelar
          </button>
          {message && <p className="error">{message}</p>}
          </form>
        </div>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Registrar abono"
        message={`Se aplicará un abono de ${money(amount)} a la venta #${selected?.id_venta}.`}
        confirmLabel="Registrar abono"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); savePayment(); }}
      />
    </section>
  );
}
