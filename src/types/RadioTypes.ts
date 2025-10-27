// types/RadioTypes.ts
import { ValidationFunction } from "../utils/validators";
import { SchemaConfig } from "./inputTypes";

export interface RadioStyleProps {
    container?: string;
    label?: string;
    optionsContainer?: string;
    optionItem?: string;
    optionLabel?: string;
    radioInput?: string;
    errorText?: string;
}

export interface RadioProps {
    name: string; // field name, maps to form state
    label: string; // field label
    value: string; // current selected value from state
    options: string[]; // array of radio button options

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
    styleProps?: RadioStyleProps;
}
