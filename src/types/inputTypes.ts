// types/inputTypes.ts
import { ValidationFunction } from "../utils/validators";

// Schema types for validation
export type SchemaType = 
    | 'required'
    | 'email'
    | 'phone'
    | 'strongPassword'
    | 'minLength'
    | 'maxLength'
    | 'fileRequired'
    | 'dateRequired';

export interface BaseSchemaConfig {
    type: SchemaType;
    message?: string;
    optional?: boolean;
}

export interface MinLengthSchema extends BaseSchemaConfig {
    type: 'minLength';
    min: number;
    optional?: boolean;
}

export interface MaxLengthSchema extends BaseSchemaConfig {
    type: 'maxLength';
    max: number;
    optional?: boolean;
}

export type SchemaConfig = 
    | SchemaType 
    | BaseSchemaConfig
    | MinLengthSchema
    | MaxLengthSchema;

export interface InputProps {
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

    // Schema for validation - supports string or object format
    schema?: SchemaConfig;

    // Optional Tailwind or custom style overrides
    styleProps?: {
        container?: string;
        label?: string;
        inputWrapper?: string;
        input?: string;
        passwordToggle?: string;
    };
}
