// components/RadioButton.tsx
import React from "react";
import clsx from "clsx";
import { RadioProps } from "../types";
import { validators, minLength, maxLength, type ValidationFunction } from "../utils";

const RadioButton: React.FC<RadioProps> = ({
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  error,
  schema,
  styleProps = {},
}) => {
  const handleRadioBlur = () => {
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
            onBlur?.(name, value, validator);
        }
    }
  };

  return (
    <div className={clsx("flex flex-col space-y-2 mb-4", styleProps.container)}>
      <label
        className={clsx(
          "text-sm font-medium text-gray-700",
          error ? "text-red-500" : "text-gray-600",
          styleProps.label
        )}
      >
        {label}
      </label>

      <div
        className={clsx("flex flex-wrap gap-4", styleProps.optionsContainer)}
      >
        {options.map((option) => (
          <div
            key={option}
            className={clsx(
              "relative flex items-center",
              "p-3 rounded-lg border-2",
              "transition-all duration-200",
              "hover:shadow-md hover:scale-105",
              value === option
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300",
              styleProps.optionItem
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              id={`${name}-${option}`}
              checked={value === option}
              onChange={() => onChange?.(name, option)}
              onBlur={handleRadioBlur}
              className={clsx(
                "appearance-none w-4 h-4 rounded-full",
                "border-2 border-gray-300",
                "checked:border-blue-500 checked:bg-blue-500",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-blue-200 focus:outline-none",
                "cursor-pointer",
                styleProps.radioInput
              )}
            />
            <label
              htmlFor={`${name}-${option}`}
              className={clsx(
                "ml-2 text-sm cursor-pointer",
                "transition-colors duration-200",
                value === option ? "text-blue-700" : "text-gray-700",
                styleProps.optionLabel
              )}
            >
              {option}
            </label>
          </div>
        ))}
      </div>

      {error && (
        <span
          className={clsx(
            "text-red-500 text-sm mt-1",
            "transition-all duration-200",
            styleProps.errorText
          )}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default RadioButton;
