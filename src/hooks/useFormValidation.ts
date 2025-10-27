import { useState, useRef } from "react";
import useDebounce from "./useDebounce";
import type { ValidationFunction } from "../utils";

// Union type for form values - can be string, File, or File array
export type FormValue = string | File | File[] | null;

interface FieldConfig {
    optional?: boolean;
    required?: boolean;
}

interface UseFormValidationProps {
    initialValues: Record<string, FormValue>;
    fieldConfigs?: Record<string, FieldConfig>;
}

const useFormValidation = ({ initialValues, fieldConfigs = {} }: UseFormValidationProps) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const validatorsRef = useRef<Record<string, ValidationFunction | ValidationFunction[]>>({});

    // Validation function that handles both single validator and array
    const validateField = (name: string, value: FormValue, validator?: ValidationFunction | ValidationFunction[]) => {
        if (!validator) return;
        
        // Handle both single validator and array of validators
        const validators = Array.isArray(validator) ? validator : [validator];
        
        for (const validate of validators) {
            const error = validate(value);
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
                return;
            }
        }
        // No errors found - clear any existing validation errors
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    // Check if field is empty
    const isFieldEmpty = (value: FormValue): boolean => {
        if (typeof value === 'string') {
            return value.trim() === '';
        }
        if (value === null) {
            return true;
        }
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return false;
    };

    // Check if field is required
    const isFieldRequired = (fieldName: string): boolean => {
        const config = fieldConfigs[fieldName];
        return !config?.optional;
    };

    // Debounced validation function (runs while typing with 500ms delay)
    const debouncedValidate = useDebounce((name: string, value: FormValue) => {
        const validator = validatorsRef.current[name];
        if (validator && touchedFields[name]) {
            // Only validate if field has been touched and has content
            if (!isFieldEmpty(value)) {
                validateField(name, value, validator);
            } else {
                // If field is empty, clear validation errors but keep required errors
                if (!isFieldRequired(name)) {
                    setErrors(prev => ({ ...prev, [name]: null }));
                }
            }
        }
    }, 500); // 500ms delay

    const handleChange = (name: string, value: FormValue) => {
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Trigger debounced validation while typing (only for string values)
        if (typeof value === 'string') {
            debouncedValidate(name, value);
        } else {
            // For File values, validate immediately if field has been touched
            const validator = validatorsRef.current[name];
            if (validator && touchedFields[name]) {
                validateField(name, value, validator);
            }
        }
    };

    const handleBlur = (name: string, value: FormValue, validator?: ValidationFunction | ValidationFunction[]) => {
        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        
        if (validator) {
            // Store validator for debounced validation on change
            validatorsRef.current[name] = validator;
            
            // Check if field is empty
            if (isFieldEmpty(value)) {
                // If field is empty and required, show required error
                if (isFieldRequired(name)) {
                    setErrors(prev => ({ ...prev, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required` }));
                } else {
                    // If field is empty and optional, clear any errors
                    setErrors(prev => ({ ...prev, [name]: null }));
                }
            } else {
                // Field has content, validate it
                validateField(name, value, validator);
            }
        }
    };

    // Check if form is valid (only checks for validation errors, not empty required fields)
    const isFormValid = () => {
        // Only check if there are any validation errors (format errors, etc.)
        // Don't check for empty required fields here - that's only done on submission
        const hasValidationErrors = Object.values(errors).some(error => error !== null);
        return !hasValidationErrors;
    };

    // Validate all fields and set errors for empty required fields (only on submission)
    const validateAllFields = () => {
        const newErrors: Record<string, string | null> = {};
        let hasErrors = false;

        // Validate each field - this runs only on form submission
        Object.entries(values).forEach(([fieldName, value]) => {
            const config = fieldConfigs[fieldName];
            
            // Check if required field is empty - show required error
            if (!config?.optional) {
                if (isFieldEmpty(value)) {
                    newErrors[fieldName] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
                    hasErrors = true;
                }
            }
            
            // Also validate non-empty fields with their validators
            if (!isFieldEmpty(value)) {
                const validator = validatorsRef.current[fieldName];
                if (validator) {
                    const validators = Array.isArray(validator) ? validator : [validator];
                    for (const validate of validators) {
                        const error = validate(value);
                        if (error) {
                            newErrors[fieldName] = error;
                            hasErrors = true;
                            break;
                        }
                    }
                }
            }
        });

        // Update errors state
        setErrors(prev => ({ ...prev, ...newErrors }));
        
        return !hasErrors;
    };

    // Handle form submission with automatic validation
    const handleSubmit = (onSubmit: (formData: Record<string, FormValue>) => void) => {
        return (e: React.FormEvent) => {
            e.preventDefault();
            
            // Validate all fields when submit is clicked
            if (!validateAllFields()) {
                // Show error message
                alert('Please fill in all required fields correctly before submitting.');
                return;
            }
            
            // If validation passes, call the user's submit function
            onSubmit(values);
        };
    };

    return {
        values,
        errors,
        handleChange,
        handleBlur,
        isFormValid: isFormValid(),
        validateAllFields,
        handleSubmit
    };
};

export default useFormValidation;
