import './Select.css'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export default function Select({ 
  label, 
  error, 
  options, 
  className = '', 
  ...props 
}: SelectProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select 
        className={`select ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}


