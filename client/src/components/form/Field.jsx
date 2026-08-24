export default function Field({ label, type = 'text', required = false, value, onChange }) {
  return (
    <label>
      {label}
      <input type={type} required={required} value={value} onChange={onChange} />
    </label>
  );
}
