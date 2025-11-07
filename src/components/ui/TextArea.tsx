// src/components/ui/TextArea.tsx
import * as React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2 w-full">
        <label htmlFor={props.id || props.name} className="text-sm font-medium text-gray-400">
          {label}
        </label>
        <textarea
          rows={4} // Altura predeterminada
          className={`
            flex w-full rounded-md border border-gray-700 bg-gray-800 
            px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            disabled:cursor-not-allowed disabled:opacity-50
            resize-y // Permite al usuario redimensionar verticalmente
            ${className}
          `}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;