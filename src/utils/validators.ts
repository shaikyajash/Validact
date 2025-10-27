// src/lib/validator.ts

// Each validator takes a value and returns either an error message or null.
export type ValidationFunction = (value: unknown) => string | null;

// --- Common Validation Functions ---

export const required = (message = "This field is required"): ValidationFunction => {
    return (value) => {
        if (value === null || value === undefined) return message;
        if (typeof value === "string" && value.trim() === "") return message;
        return null;
    };
};

export const email = (
    message = "Please enter a valid email address",
    optional = false
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string") return message;
        const trimmed = value.trim();
        
        // If field is optional and empty, it's valid
        if (optional && trimmed === "") return null;
        
        // Otherwise validate email format
        return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(trimmed) ? null : message;
    };
};

export const phone = (
    message = "Please enter a valid phone number",
    optional = false
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string") return message;
        const trimmed = value.trim();
        
        // If field is optional and empty, it's valid
        if (optional && trimmed === "") return null;
        
        // Otherwise validate phone format
        return /^(\+?\d{1,3}[-.\s]?)?\d{10}$/.test(trimmed) ? null : message;
    };
};

export const strongPassword = (
    message = "Password must be 8+ chars, include upper, lower, number, and special char"
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string") return message;
        const v = value.trim();
        if (v.length < 8) return message;
        if (!/[A-Z]/.test(v) || !/[a-z]/.test(v) || !/[0-9]/.test(v) || !/[!@#$%^&*]/.test(v))
            return message;
        return null;
    };
};

export const minLength = (
    min: number,
    message = `Must be at least ${min} characters`,
    optional = false
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string") return message;
        const trimmed = value.trim();
        
        // If field is optional and empty, it's valid
        if (optional && trimmed === "") return null;
        
        // Otherwise validate length
        return trimmed.length >= min ? null : message;
    };
};

export const maxLength = (
    max: number,
    message = `Must be less than ${max} characters`,
    optional = false
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string") return message;
        const trimmed = value.trim();
        
        // If field is optional and empty, it's valid
        if (optional && trimmed === "") return null;
        
        // Otherwise validate length
        return trimmed.length <= max ? null : message;
    };
};

export const fileRequired = (
    message = "Please select a file"
): ValidationFunction => {
    return (value) => {
        return value instanceof File ? null : message;
    };
};

export const fileRequiredMultiple = (
    message = "Please select files"
): ValidationFunction => {
    return (value) => {
        return Array.isArray(value) && value.length > 0 ? null : message;
    };
};

export const fileType = (
    allowedTypes: string[],
    message?: string
): ValidationFunction => {
    return (value) => {
        if (!(value instanceof File)) {
            return message || "Please select a file";
        }
        
        const fileExtension = '.' + value.name.split('.').pop()?.toLowerCase();
        const mimeType = value.type.toLowerCase();
        
        // Check if file extension or MIME type matches allowed types
        const isValidType = allowedTypes.some(type => {
            const normalizedType = type.toLowerCase();
            return fileExtension === normalizedType || 
                   mimeType === normalizedType ||
                   mimeType.startsWith(normalizedType + '/');
        });
        
        if (!isValidType) {
            return message || `File type must be one of: ${allowedTypes.join(', ')}`;
        }
        
        return null;
    };
};

export const fileTypeMultiple = (
    allowedTypes: string[],
    message?: string
): ValidationFunction => {
    return (value) => {
        if (!Array.isArray(value) || value.length === 0) {
            return message || "Please select files";
        }
        
        for (const file of value) {
            if (!(file instanceof File)) {
                return message || "Please select valid files";
            }
            
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
            const mimeType = file.type.toLowerCase();
            
            // Check if file extension or MIME type matches allowed types
            const isValidType = allowedTypes.some(type => {
                const normalizedType = type.toLowerCase();
                return fileExtension === normalizedType || 
                       mimeType === normalizedType ||
                       mimeType.startsWith(normalizedType + '/');
            });
            
            if (!isValidType) {
                return message || `All files must be one of: ${allowedTypes.join(', ')}`;
            }
        }
        
        return null;
    };
};

export const dateRequired = (
    message = "Please select a valid date"
): ValidationFunction => {
    return (value) => {
        if (typeof value !== "string" || !value) return message;
        const d = new Date(value);
        return isNaN(d.getTime()) ? message : null;
    };
};

// --- Export a unified object for easy imports ---
export const validators = {
    required,
    email,
    phone,
    strongPassword,
    minLength,
    maxLength,
    fileRequired,
    fileRequiredMultiple,
    fileType,
    fileTypeMultiple,
    dateRequired,
};

export default validators;
