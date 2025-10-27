// components/Input.tsx
import { useState, type FC } from "react";
import clsx from "clsx";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { InputProps } from "../types";
import { validators, minLength, maxLength, type ValidationFunction } from "../utils";

const Input: FC<InputProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  schema,
  styleProps = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Helper function to get the schema type and determine if it's strongPassword
  const getSchemaType = (): string | null => {
    if (!schema) return null;
    if (typeof schema === 'string') return schema;
    return schema.type;
  };

  const isStrongPassword = getSchemaType() === 'strongPassword';

  const handleInputBlur = () => {
    if (onBlur) {
        if (schema) {
            let validator: ValidationFunction | undefined;

            // Handle string schema (simple case)
            if (typeof schema === 'string') {
                const factoryFn = validators[schema];
                const createValidator = factoryFn as (...args: unknown[]) => ValidationFunction;
                validator = createValidator();
            }
            // Handle object schema (with custom message or parameters)
            else {
                const { type, message, optional } = schema;

                if (type === 'minLength' && 'min' in schema) {
                    validator = minLength(schema.min, message, optional);
                }
                else if (type === 'maxLength' && 'max' in schema) {
                    validator = maxLength(schema.max, message, optional);
                }
                else {
                    // For other validators, pass custom message and optional flag if provided
                    const factoryFn = validators[type];
                    const createValidator = factoryFn as (message?: string, optional?: boolean) => ValidationFunction;
                    validator = createValidator(message, optional);
                }
            }

            if (validator) {
                onBlur?.(name, value, validator);
            }
        } else {
            // No schema provided - call onBlur directly (for custom validation)
            onBlur?.(name, value);
        }
    }
  };

  return (
    <div className={clsx("flex flex-col relative mb-4", styleProps.container)}>
      <label
        htmlFor={name}
        className={clsx(
          "absolute -top-2.5 left-2 px-1 text-sm transition-all duration-200 bg-white",
          error ? "text-red-500" : "text-gray-600",
          styleProps.label
        )}
      >
        {label}
      </label>

      <div
        className={clsx(
          "border rounded-lg transition-all duration-200",
          "hover:border-blue-400 focus-within:border-blue-500",
          error ? "border-red-500" : "border-gray-300",
          styleProps.inputWrapper
        )}
      >
        <div className="flex items-center px-3 py-2">
          <input
            id={name}
            value={value}
            onChange={(e) => onChange?.(name, e.target.value)}
            onBlur={handleInputBlur}
            className={clsx(
              "w-full outline-none bg-transparent text-gray-800 placeholder-gray-400",
              styleProps.input
            )}
            type={
              isStrongPassword && !showPassword ? "password" : "text"
            }
          />

          {isStrongPassword && (
            <span
              onClick={togglePasswordVisibility}
              className={clsx(
                "ml-2 p-1 rounded-full cursor-pointer text-gray-500 hover:text-blue-500 transition-transform duration-200",
                styleProps.passwordToggle
              )}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          )}
        </div>
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
