// components/TextArea.tsx
import React from "react";
import clsx from "clsx";
import { TextAreaProps } from "../types";
import { validators, minLength, maxLength, type ValidationFunction } from "../utils";

const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  schema,
  styleProps = {},
}) => {
  const handleTextAreaBlur = () => {
    if (onBlur && schema) {
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
            onBlur(name, value, validator);
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
          error ? "border-red-500" : "border-gray-300"
        )}
      >
        <textarea
          id={name}
          value={value}
          onChange={(e) => onChange?.(name, e.target.value)}
          onBlur={handleTextAreaBlur}
          rows={4}
          className={clsx(
            "w-full p-3 outline-none bg-transparent text-gray-800 placeholder-gray-400",
            "resize-y min-h-[100px]",
            styleProps.textArea
          )}
        />
      </div>

      {error && <p className={clsx("mt-1 text-sm text-red-500", styleProps.errorText)}>{error}</p>}
    </div>
  );
};

export default TextArea;

