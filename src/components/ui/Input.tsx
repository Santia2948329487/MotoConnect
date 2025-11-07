// src/components/ui/Input.tsx
import * as React from 'react';

// Se utiliza '...'props para pasar cualquier propiedad estándar de un input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Usamos React.forwardRef para poder usarlo con librerías de formularios si las usas
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type = 'text', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2 w-full">
        <label htmlFor={props.id || props.name} className="text-sm font-medium text-gray-400">
          {label}
        </label>
        <input
          type={type}
          className={`
            flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 
            px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            disabled:cursor-not-allowed disabled:opacity-50
            ${className}
          `}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;