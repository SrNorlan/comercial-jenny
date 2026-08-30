import { useState } from 'react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  const [confirmed, setConfirmed] = useState(false);

  if (!open) return null;

  function close() {
    setConfirmed(false);
    onCancel();
  }

  function confirm() {
    if (!confirmed) return;
    setConfirmed(false);
    onConfirm();
  }

  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={close}>
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="eyebrow">CONFIRMACIÓN</p>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p>{message}</p>
        <label className="confirm-check">
          <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
          <span>Confirmo que deseo realizar esta operación.</span>
        </label>
        <div className="confirm-actions">
          <button type="button" className="text-button" onClick={close}>Cancelar</button>
          <button type="button" className="checkout-button" disabled={!confirmed} onClick={confirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
