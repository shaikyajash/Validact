// components/SubmitButton.tsx
import { type FC } from "react";
import clsx from "clsx";
import { SubmitButtonProps } from "../types";

const SubmitButton: FC<SubmitButtonProps> = ({
  disabled = false,
  label = "Submit",
  styleProps = {},
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={clsx(
        // Base styles
        "w-full px-4 py-2.5 rounded-lg",
        "font-medium text-white",
        "transition-all duration-200",
        "transform hover:scale-[1.02] active:scale-[0.98]",
        "shadow-sm hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-300",

        // Enabled state
        !disabled && ["bg-blue-500 hover:bg-blue-600", "active:bg-blue-700"],

        // Disabled state
        disabled && [
          "bg-blue-300 cursor-not-allowed",
          "transform-none shadow-none",
        ],

        styleProps.base
      )}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
