// FilePicker component types

export interface FilePickerStyleProps {
    container?: string;
    label?: string;
    input?: string;
    button?: string;
    fileName?: string;
    errorText?: string;
    fileInfo?: string;
    dragArea?: string;
}

export interface FilePickerProps {
    name: string;
    label: string;
    value: File | File[] | null; // Support both single and multiple files
    onChange: (name: string, value: any) => void; // Unified handler
    onBlur: (name: string, value: any, validator?: any) => void; // Unified handler
    error?: string | null;
    schema: 'file' | FilePickerSchema;
    styleProps?: FilePickerStyleProps;
    accept?: string; // HTML accept attribute for file input
    multiple?: boolean; // Allow multiple file selection
    maxSize?: number; // Maximum file size in bytes
    showFileInfo?: boolean; // Show file name and size
    dragAndDrop?: boolean; // Enable drag and drop functionality
}

// Schema types for file validation
export interface FilePickerSchema {
    type: 'file';
    message?: string;
    optional?: boolean;
    allowedTypes?: string[]; // e.g., ['.pdf', '.jpg', 'image/jpeg']
    maxSize?: number; // Maximum file size in bytes
    minSize?: number; // Minimum file size in bytes
}

// File info display component props
export interface FileInfoProps {
    file: File;
    onRemove?: () => void;
    styleProps?: {
        container?: string;
        name?: string;
        size?: string;
        removeButton?: string;
    };
}

// File list component props for multiple files
export interface FileListProps {
    files: File[];
    onRemoveFile?: (index: number) => void;
    onRemoveAll?: () => void;
    styleProps?: {
        container?: string;
        fileItem?: string;
        removeAllButton?: string;
        emptyState?: string;
    };
}

// Drag and drop area props
export interface DragDropAreaProps {
    onFileSelect: (files: FileList) => void;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    styleProps?: {
        container?: string;
        text?: string;
        icon?: string;
    };
}
