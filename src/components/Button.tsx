import './Button.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}


