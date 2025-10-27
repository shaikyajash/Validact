// types/TextAreaTypes.ts
import { ValidationFunction } from "../utils/validators";
import { SchemaConfig } from "./inputTypes";

export interface TextAreaStyleProps {
    container?: string;
    label?: string;
    textArea?: string;
    errorText?: string;
}

export interface TextAreaProps {
    name: string; // field name, maps to form state
    label: string; // input label
    value: string; // current value from state

    // Optional handlers
    onChange?: (name: string, value: string) => void;
    onBlur?: (
        name: string,
        value: string,
        validator?: ValidationFunction | ValidationFunction[]
    ) => void;

    // Error message from validation
    error?: string | null;

    // Schema for validation - supports string or object format (same as Input)
    schema?: SchemaConfig;

    // Optional Tailwind or custom style overrides
    styleProps?: TextAreaStyleProps;
}

