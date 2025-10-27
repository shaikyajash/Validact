# Form Validator

A powerful, lightweight React form validation library with real-time validation, debounced input handling, and comprehensive form components.

## Features

- 🚀 **Real-time Validation** - Validate fields as users type with 500ms debounce
- 📝 **Multiple Input Types** - Input, TextArea, RadioButton, DropDown, FilePicker, SubmitButton
- 🔒 **Type Safety** - Full TypeScript support with comprehensive type definitions
- 🎨 **Customizable Styling** - Tailwind CSS classes with custom style props
- 📁 **File Upload Support** - Single and multiple file upload with drag & drop
- ⚡ **Zero Dependencies** - Lightweight with minimal external dependencies
- 🔧 **Flexible Validation** - Built-in validators with custom validation support
- 🎯 **Easy Integration** - Simple API with unified form state management

## Installation

```bash
npm install validact
# or
yarn add validact
```

## Quick Start

```tsx
import React from 'react';
import { Input, TextArea, SubmitButton, useFormValidation } from '@your-username/form-validator';

const MyForm = () => {
  const initialValues = {
    name: '',
    email: '',
    message: ''
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation({
    initialValues
  });

  const onSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="name"
        label="Full Name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        schema={{ type: 'required', message: 'Name is required' }}
      />
      
      <Input
        name="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        schema={{ type: 'email', message: 'Please enter a valid email' }}
      />
      
      <TextArea
        name="message"
        label="Message"
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.message}
        schema={{ type: 'minLength', min: 10, message: 'Message must be at least 10 characters' }}
      />
      
      <SubmitButton label="Submit Form" />
    </form>
  );
};
```

## Components

### Input
Text input with validation support.

```tsx
<Input
  name="email"
  label="Email Address"
  value={formData.email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  schema={{ type: 'email', message: 'Please enter a valid email' }}
  styleProps={{
    container: "mb-4",
    label: "text-sm font-medium",
    input: "px-3 py-2 border rounded"
  }}
/>
```

### TextArea
Multi-line text input with validation.

```tsx
<TextArea
  name="message"
  label="Your Message"
  value={formData.message}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.message}
  schema={{ type: 'minLength', min: 10, message: 'Message must be at least 10 characters' }}
/>
```

### RadioButton
Radio button group with validation.

```tsx
<RadioButton
  name="gender"
  label="Gender"
  value={formData.gender}
  options={["Male", "Female", "Other"]}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.gender}
  schema={{ type: 'required', message: 'Please select a gender' }}
/>
```

### DropDown
Searchable dropdown with validation.

```tsx
<DropDown
  name="country"
  label="Country"
  value={formData.country}
  options={["USA", "Canada", "UK", "Germany"]}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.country}
  schema={{ type: 'required', message: 'Please select a country' }}
/>
```

### FilePicker
File upload with drag & drop and validation.

```tsx
<FilePicker
  name="resume"
  label="Upload Resume"
  value={formData.resume}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.resume}
  schema={{
    type: 'file',
    allowedTypes: ['.pdf', '.doc', '.docx'],
    message: 'Please upload a valid document'
  }}
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024} // 5MB
  multiple={true}
  dragAndDrop={true}
  showFileInfo={true}
/>
```

### SubmitButton
Form submission button with validation state.

```tsx
<SubmitButton
  label="Submit Form"
  disabled={!isFormValid}
  styleProps={{
    base: "w-full px-4 py-2 rounded-lg font-medium"
  }}
/>
```

## Validation Schemas

### String Schemas
```tsx
schema="required"           // Required field
schema="email"              // Email validation
schema="phone"              // Phone validation
schema="strongPassword"     // Strong password validation
```

### Object Schemas
```tsx
// Required with custom message
schema={{ type: 'required', message: 'This field is required' }}

// Email with custom message
schema={{ type: 'email', message: 'Please enter a valid email' }}

// Length validation
schema={{ type: 'minLength', min: 5, message: 'Must be at least 5 characters' }}
schema={{ type: 'maxLength', max: 100, message: 'Must be less than 100 characters' }}

// File validation
schema={{
  type: 'file',
  allowedTypes: ['.pdf', '.jpg', '.png'],
  message: 'Please upload a valid file'
}}

// Optional fields
schema={{ type: 'email', message: 'Invalid email', optional: true }}
```

## Built-in Validators

- `required` - Field is required
- `email` - Valid email format
- `phone` - Valid phone number
- `strongPassword` - Strong password requirements
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `fileRequired` - File is required
- `fileType` - File type validation
- `dateRequired` - Valid date format

## Custom Validation

You can create custom validation functions for fields that need specific validation logic beyond the built-in validators.

### Creating Custom Validators

Custom validators must follow the `ValidationFunction` type:

```tsx
import { ValidationFunction } from '@your-username/form-validator';

const validateAge: ValidationFunction = (value) => {
  if (typeof value !== 'string') return 'Age must be a number';
  const age = parseInt(value.trim());
  
  if (isNaN(age)) return 'Please enter a valid age';
  if (age < 18) return 'You must be at least 18 years old';
  if (age > 120) return 'Please enter a realistic age';
  
  return null; // No error
};
```

### Using Custom Validators

Pass your custom validation function directly to the `onBlur` handler:

```tsx
<Input
  name="age"
  label="Age"
  value={formData.age}
  onChange={handleChange}
  onBlur={(name, value) => handleBlur(name, value, validateAge)}
  error={errors.age}
/>
```

### Custom Validation Features

- **On Blur Validation**: Validates when user leaves the field
- **Debounced Validation**: Validates while typing with 500ms delay
- **Real-time Error Display**: Shows errors immediately below the input
- **Form Submission Validation**: Validates again on form submit

### Custom Validation Examples

```tsx
// Age validation (18-120 years)
const validateAge: ValidationFunction = (value) => {
  if (typeof value !== 'string') return 'Age must be a number';
  const age = parseInt(value.trim());
  
  if (isNaN(age)) return 'Please enter a valid age';
  if (age < 18) return 'You must be at least 18 years old';
  if (age > 120) return 'Please enter a realistic age';
  
  return null;
};

// Username validation (alphanumeric, 3-20 chars)
const validateUsername: ValidationFunction = (value) => {
  if (typeof value !== 'string') return 'Username must be text';
  const trimmed = value.trim();
  
  if (trimmed.length < 3) return 'Username must be at least 3 characters';
  if (trimmed.length > 20) return 'Username must be less than 20 characters';
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return 'Username can only contain letters, numbers, and underscores';
  
  return null;
};

// Custom email domain validation
const validateCompanyEmail: ValidationFunction = (value) => {
  if (typeof value !== 'string') return 'Email must be text';
  const trimmed = value.trim();
  
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  
  if (!trimmed.endsWith('@company.com')) {
    return 'Email must be from @company.com domain';
  }
  
  return null;
};
```

## Field Configuration

### Required vs Optional Fields

**By default, all fields are REQUIRED** unless explicitly marked as optional in the `fieldConfigs`.

### Making Fields Optional

Use the `fieldConfigs` parameter in `useFormValidation` to make fields optional:

```tsx
const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation({
  initialValues: {
    name: '',
    email: '',
    website: '', // This field will be optional
    phone: ''
  },
  fieldConfigs: {
    website: { optional: true }, // Website is optional
    phone: { optional: true }    // Phone is optional
  }
});
```

### Field Configuration Options

```tsx
interface FieldConfig {
  optional?: boolean;  // Make field optional (default: false)
  required?: boolean;  // Explicitly mark as required (default: true)
}
```

### Optional Field Behavior

- **Empty optional fields**: No validation errors shown
- **Non-empty optional fields**: Validated according to their schema
- **Required fields**: Show "Field is required" error when empty

### Examples

```tsx
// All fields required by default
const initialValues = {
  name: '',
  email: '',
  website: ''
};

// Only website is optional
const fieldConfigs = {
  website: { optional: true }
};

// Usage in components
<Input
  name="website"
  label="Website (Optional)"
  value={formData.website}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.website}
  schema={{ type: 'email', message: 'Please enter a valid URL', optional: true }}
/>
```

## Form State Management

The `useFormValidation` hook provides:

```tsx
const {
  values,        // Current form values
  errors,        // Validation errors
  handleChange,  // Handle input changes
  handleBlur,    // Handle input blur
  handleSubmit,  // Handle form submission
  isFormValid,   // Form validation state
  validateAllFields // Manual validation
} = useFormValidation({
  initialValues: { name: '', email: '' },
  fieldConfigs: { website: { optional: true } }
});
```

## Complete Example

Here's a complete example showing custom validation and field configuration:

```tsx
import React from 'react';
import { Input, TextArea, SubmitButton, useFormValidation, ValidationFunction } from '@your-username/form-validator';

const ContactForm = () => {
  // Custom validation functions
  const validateAge: ValidationFunction = (value) => {
    if (typeof value !== 'string') return 'Age must be a number';
    const age = parseInt(value.trim());
    
    if (isNaN(age)) return 'Please enter a valid age';
    if (age < 18) return 'You must be at least 18 years old';
    if (age > 120) return 'Please enter a realistic age';
    
    return null;
  };

  const validatePhone: ValidationFunction = (value) => {
    if (typeof value !== 'string') return 'Phone must be text';
    const trimmed = value.trim();
    
    if (trimmed === '') return null; // Optional field
    if (!/^\+?[\d\s\-\(\)]{10,}$/.test(trimmed)) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  };

  const initialValues = {
    name: '',
    email: '',
    age: '',
    phone: '',      // Optional field
    website: '',    // Optional field
    message: ''
  };

  const fieldConfigs = {
    phone: { optional: true },    // Phone is optional
    website: { optional: true }  // Website is optional
  };

  const { values, errors, handleChange, handleBlur, handleSubmit } = useFormValidation({
    initialValues,
    fieldConfigs
  });

  const onSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Required field with built-in validation */}
      <Input
        name="name"
        label="Full Name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        schema={{ type: 'required', message: 'Name is required' }}
      />

      {/* Required field with built-in validation */}
      <Input
        name="email"
        label="Email Address"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        schema={{ type: 'email', message: 'Please enter a valid email' }}
      />

      {/* Required field with custom validation */}
      <Input
        name="age"
        label="Age"
        value={values.age}
        onChange={handleChange}
        onBlur={(name, value) => handleBlur(name, value, validateAge)}
        error={errors.age}
      />

      {/* Optional field with custom validation */}
      <Input
        name="phone"
        label="Phone Number (Optional)"
        value={values.phone}
        onChange={handleChange}
        onBlur={(name, value) => handleBlur(name, value, validatePhone)}
        error={errors.phone}
      />

      {/* Optional field with built-in validation */}
      <Input
        name="website"
        label="Website (Optional)"
        value={values.website}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.website}
        schema={{ type: 'email', message: 'Please enter a valid URL', optional: true }}
      />

      {/* Required field with built-in validation */}
      <TextArea
        name="message"
        label="Message"
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.message}
        schema={{ type: 'minLength', min: 10, message: 'Message must be at least 10 characters' }}
      />

      <SubmitButton label="Submit Contact Form" />
    </form>
  );
};
```

## Styling

All components support custom styling through `styleProps`:

```tsx
<Input
  styleProps={{
    container: "mb-4",
    label: "text-sm font-medium text-gray-700",
    input: "px-3 py-2 border border-gray-300 rounded-md",
    errorText: "text-red-500 text-sm mt-1"
  }}
/>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import { FormValue, InputProps, ValidationFunction } from '@your-username/form-validator';
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### 1.0.0
- Initial release
- Real-time validation with debounce
- Multiple form components
- File upload support
- TypeScript support
- Customizable styling