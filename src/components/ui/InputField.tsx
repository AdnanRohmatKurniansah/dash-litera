import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", success, error, hint, ...props }, ref) => {
    const isDate = props.type === "date";

    let inputClasses =
      "h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs " +
      "placeholder:text-gray-400 focus:outline-none focus:ring-3 " +
      "dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ";

    if (!isDate) {
      inputClasses += "appearance-none ";
    } 

    if (props.disabled) {
      inputClasses +=
        "text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed ";
    } else if (error) {
      inputClasses +=
        "border-error-500 focus:border-error-300 focus:ring-error-500/20 ";
    } else if (success) {
      inputClasses +=
        "border-success-500 focus:border-success-300 focus:ring-success-500/20 ";
    } else {
      inputClasses +=
        "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 ";
    }

    return (
      <div className="relative">
        <input
          ref={ref}        
          {...props}       
          className={`${inputClasses} ${className}`}
        />

        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
