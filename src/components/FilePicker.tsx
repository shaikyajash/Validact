// components/FilePicker.tsx
import React, { useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { FilePickerProps, FileInfoProps, FileListProps, DragDropAreaProps } from "../types";
import { validators, fileRequired, fileRequiredMultiple, fileType, fileTypeMultiple, type ValidationFunction } from "../utils";

// File Info Component
const FileInfo: React.FC<FileInfoProps> = ({ file, onRemove, styleProps = {} }) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={clsx("flex items-center justify-between p-2 bg-gray-50 rounded border", styleProps.container)}>
            <div className="flex-1 min-w-0">
                <p className={clsx("text-sm font-medium text-gray-900 truncate", styleProps.name)}>
                    {file.name}
                </p>
                <p className={clsx("text-xs text-gray-500", styleProps.size)}>
                    {formatFileSize(file.size)}
                </p>
            </div>
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className={clsx(
                        "ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded",
                        "transition-colors duration-200",
                        styleProps.removeButton
                    )}
                    aria-label="Remove file"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

// File List Component for multiple files
const FileList: React.FC<FileListProps> = ({ files, onRemoveFile, onRemoveAll, styleProps = {} }) => {
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (files.length === 0) {
        return (
            <div className={clsx("text-center py-4 text-gray-500", styleProps.emptyState)}>
                No files selected
            </div>
        );
    }

    return (
        <div className={clsx("space-y-2", styleProps.container)}>
            {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className={clsx("flex items-center justify-between p-2 bg-gray-50 rounded border", styleProps.fileItem)}>
                    <div className="flex-1 min-w-0">
                        <p className={clsx("text-sm font-medium text-gray-900 truncate")}>
                            {file.name}
                        </p>
                        <p className={clsx("text-xs text-gray-500")}>
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                    {onRemoveFile && (
                        <button
                            type="button"
                            onClick={() => onRemoveFile(index)}
                            className={clsx(
                                "ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded",
                                "transition-colors duration-200"
                            )}
                            aria-label={`Remove ${file.name}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
            {files.length > 1 && onRemoveAll && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onRemoveAll}
                        className={clsx(
                            "px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded",
                            "transition-colors duration-200",
                            styleProps.removeAllButton
                        )}
                    >
                        Remove All
                    </button>
                </div>
            )}
        </div>
    );
};

// Drag and Drop Area Component
const DragDropArea: React.FC<DragDropAreaProps> = ({ 
    onFileSelect, 
    accept, 
    multiple = false,
    disabled = false,
    styleProps = {} 
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files);
        }
    }, [disabled, onFileSelect]);

    const handleClick = useCallback(() => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [disabled]);

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        onFileSelect(e.target.files);
                    }
                }}
                className="hidden"
            />
            <div
                className={clsx(
                    "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
                    isDragOver && !disabled ? "border-blue-400 bg-blue-50" : "border-gray-300",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-gray-400",
                    styleProps.container
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <svg
                    className={clsx("mx-auto h-12 w-12 text-gray-400", styleProps.icon)}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                >
                    <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <p className={clsx("mt-2 text-sm text-gray-600", styleProps.text)}>
                    {multiple ? "Drag and drop files here, or click to select" : "Drag and drop a file here, or click to select"}
                </p>
                {accept && (
                    <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: {accept}
                    </p>
                )}
            </div>
        </>
    );
};

const FilePicker: React.FC<FilePickerProps> = ({
    name,
    label,
    value,
    onChange,
    onBlur,
    error,
    schema,
    styleProps = {},
    accept,
    multiple = false,
    maxSize,
    showFileInfo = true,
    dragAndDrop = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileBlur = () => {
        if (onBlur && schema) {
            let validator: ValidationFunction | undefined;

            // Handle string schema (simple case)
            if (typeof schema === 'string') {
                if (schema === 'file') {
                    validator = fileRequired();
                } else {
                    const factoryFn = validators[schema as keyof typeof validators];
                    const createValidator = factoryFn as (...args: unknown[]) => ValidationFunction;
                    validator = createValidator();
                }
            }
            // Handle object schema (with custom message or parameters)
            else {
                const { type, message, allowedTypes } = schema;

                if (type === 'file') {
                    if (allowedTypes) {
                        validator = fileType(allowedTypes, message);
                    } else {
                        validator = fileRequired(message);
                    }
                }
            }

            if (validator) {
                onBlur(name, value, validator);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            
            // Check file size if maxSize is specified
            if (maxSize) {
                const oversizedFiles = fileArray.filter(file => file.size > maxSize);
                if (oversizedFiles.length > 0) {
                    const sizeError = `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
                    if (onBlur) {
                        onBlur(name, null, () => sizeError);
                    }
                    return;
                }
            }
            
            // Handle single vs multiple files
            let finalFiles;
            if (multiple) {
                // For multiple files, combine with existing files
                const existingFiles = Array.isArray(value) ? value : [];
                finalFiles = [...existingFiles, ...fileArray];
                onChange(name, finalFiles);
            } else {
                // For single file, replace
                finalFiles = fileArray[0];
                onChange(name, finalFiles);
            }
            
            // Trigger validation immediately after file selection
            if (onBlur && schema) {
                let validator: ValidationFunction | undefined;

                // Handle string schema (simple case)
                if (typeof schema === 'string') {
                    if (schema === 'file') {
                        validator = multiple ? fileRequiredMultiple() : fileRequired();
                    } else {
                        const factoryFn = validators[schema as keyof typeof validators];
                        const createValidator = factoryFn as (...args: unknown[]) => ValidationFunction;
                        validator = createValidator();
                    }
                }
                // Handle object schema (with custom message or parameters)
                else {
                    const { type, message, allowedTypes } = schema;

                    if (type === 'file') {
                        if (allowedTypes) {
                            validator = multiple ? fileTypeMultiple(allowedTypes, message) : fileType(allowedTypes, message);
                        } else {
                            validator = multiple ? fileRequiredMultiple(message) : fileRequired(message);
                        }
                    }
                }

                if (validator) {
                    onBlur(name, finalFiles, validator);
                }
            }
        } else {
            onChange(name, null);
        }
    };

    const handleFileSelect = (files: FileList) => {
        if (files.length > 0) {
            const fileArray = Array.from(files);
            
            // Check file size if maxSize is specified
            if (maxSize) {
                const oversizedFiles = fileArray.filter(file => file.size > maxSize);
                if (oversizedFiles.length > 0) {
                    const sizeError = `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
                    if (onBlur) {
                        onBlur(name, null, () => sizeError);
                    }
                    return;
                }
            }
            
            // Handle single vs multiple files
            let finalFiles;
            if (multiple) {
                // For multiple files, combine with existing files
                const existingFiles = Array.isArray(value) ? value : [];
                finalFiles = [...existingFiles, ...fileArray];
                onChange(name, finalFiles);
            } else {
                // For single file, replace
                finalFiles = fileArray[0];
                onChange(name, finalFiles);
            }
            
            // Trigger validation immediately after file selection
            if (onBlur && schema) {
                let validator: ValidationFunction | undefined;

                // Handle string schema (simple case)
                if (typeof schema === 'string') {
                    if (schema === 'file') {
                        validator = multiple ? fileRequiredMultiple() : fileRequired();
                    } else {
                        const factoryFn = validators[schema as keyof typeof validators];
                        const createValidator = factoryFn as (...args: unknown[]) => ValidationFunction;
                        validator = createValidator();
                    }
                }
                // Handle object schema (with custom message or parameters)
                else {
                    const { type, message, allowedTypes } = schema;

                    if (type === 'file') {
                        if (allowedTypes) {
                            validator = multiple ? fileTypeMultiple(allowedTypes, message) : fileType(allowedTypes, message);
                        } else {
                            validator = multiple ? fileRequiredMultiple(message) : fileRequired(message);
                        }
                    }
                }

                if (validator) {
                    onBlur(name, finalFiles, validator);
                }
            }
        }
    };

    const handleRemoveFile = () => {
        onChange(name, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveFileAtIndex = (index: number) => {
        if (Array.isArray(value)) {
            const newFiles = value.filter((_, i) => i !== index);
            onChange(name, newFiles.length > 0 ? newFiles : null);
        }
    };

    const handleRemoveAllFiles = () => {
        onChange(name, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
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
                {dragAndDrop ? (
                    <DragDropArea
                        onFileSelect={handleFileSelect}
                        accept={accept}
                        multiple={multiple}
                        styleProps={styleProps}
                    />
                ) : (
                    <div className="p-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id={name}
                            name={name}
                            accept={accept}
                            multiple={multiple}
                            onChange={handleFileChange}
                            onBlur={handleFileBlur}
                            className="hidden"
                        />
                        
                        <button
                            type="button"
                            onClick={handleClick}
                            className={clsx(
                                "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm",
                                "bg-white text-sm font-medium text-gray-700",
                                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                "transition-colors duration-200",
                                styleProps.button
                            )}
                        >
                            Choose File
                        </button>
                    </div>
                )}

                {showFileInfo && value && (
                    <div className="px-3 pb-3">
                        {(() => {
                            
                            if (multiple && Array.isArray(value)) {
                                return (
                                    <FileList
                                        files={value}
                                        onRemoveFile={handleRemoveFileAtIndex}
                                        onRemoveAll={handleRemoveAllFiles}
                                        styleProps={styleProps}
                                    />
                                );
                            } else if (!multiple && value && !Array.isArray(value)) {
                                return (
                                    <FileInfo
                                        file={value}
                                        onRemove={handleRemoveFile}
                                        styleProps={styleProps}
                                    />
                                );
                            }
                            return null;
                        })()}
                    </div>
                )}

                {!value && !dragAndDrop && (
                    <div className="px-3 pb-3">
                        <p className={clsx("text-sm text-gray-500", styleProps.fileName)}>
                            {multiple ? "No files selected" : "No file selected"}
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className={clsx("mt-1 text-sm text-red-500", styleProps.errorText)}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default FilePicker;
