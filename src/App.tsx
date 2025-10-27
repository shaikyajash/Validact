import { type FC } from 'react';
import { Input, TextArea, RadioButton, SubmitButton, DropDown, FilePicker } from './components';
import { useFormValidation, type FormValue } from './hooks';
import { type ValidationFunction } from './utils';

const App: FC = () => {
    // Custom validation function for age
    const validateAge: ValidationFunction = (value) => {
        if (typeof value !== 'string') return 'Age must be a number';
        const age = parseInt(value.trim());
        
        if (isNaN(age)) return 'Please enter a valid age';
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 120) return 'Please enter a realistic age';
        
        return null; // No error
    };

    const initialValues: Record<string, FormValue> = {
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        message: '',
        website: '', // Optional field
        gender: '', // Radio button field
        country: '', // DropDown field
        age: '', // Custom validation field
        resume: null as File | File[] | null // File picker field
    };

    const fieldConfigs = {
        website: { optional: true }, // Website is optional
        age: { optional: false } // Age is required
    };

    const { values: formData, errors, handleChange, handleBlur, handleSubmit, /*isFormValid*/ } = useFormValidation({
        initialValues,
        fieldConfigs
    });

    // User just needs to define what happens when form is successfully submitted
    const onSubmit = (formData: Record<string, FormValue>) => {
        console.log('Form data:', formData);
        console.log('Resume file:', formData.resume);
        alert('Form submitted! Check console for data.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Form Validator Demo</h1>
                <p className="text-gray-600 mb-2">Real-time validation with 500ms debounce while typing</p>
                <p className="text-sm text-gray-500 mb-8">Includes Input, TextArea, RadioButton, DropDown, FilePicker, and SubmitButton components</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.fullName}
                        schema={{ type: 'required', message: 'Name is required' }}
                    />

                    <Input
                        name="email"
                        label="Email Address"
                        value={formData.email as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                        schema={{ type: 'email', message: 'Please enter a valid email address' }}
                    />

                    <Input
                        name="phone"
                        label="Phone Number"
                        value={formData.phone as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.phone}
                        schema={{ type: 'phone', message: 'Enter a valid 10-digit phone number' }}
                    />

                    <Input
                        name="username"
                        label="Username"
                        value={formData.username as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.username}
                        schema={{ type: 'minLength', min: 4, message: 'Username must be at least 4 characters' }}
                    />

                    <Input
                        name="age"
                        label="Age"
                        value={formData.age as string || ''}
                        onChange={handleChange}
                        onBlur={(name, value) => handleBlur(name, value, validateAge)}
                        error={errors.age}
                    />

                    <Input
                        name="password"
                        label="Password"
                        value={formData.password as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        schema="strongPassword"
                    />

                    <TextArea
                        name="message"
                        label="Message"
                        value={formData.message as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.message}
                        schema={{ type: 'minLength', min: 10, message: 'Message must be at least 10 characters' }}
                    />

                    {/* Optional field - validates format only when value is provided */}
                    <Input
                        name="website"
                        label="Website (Optional)"
                        value={formData.website as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.website}
                        schema={{ type: 'email', message: 'Please enter a valid email address', optional: true }}
                    />

                    <RadioButton
                        name="gender"
                        label="Gender"
                        value={formData.gender as string}
                        options={["Male", "Female", "Other", "Prefer not to say"]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.gender}
                        schema={{ type: 'required', message: 'Please select a gender' }}
                    />

                    {/* is always required, so no need to pass schema */}
                    <DropDown
                        name="country"
                        label="Country"
                        value={formData.country as string}
                        options={[
                            "United States", "Canada", "United Kingdom", "Germany",
                            "France", "Italy", "Spain", "Netherlands", "Sweden",
                            "Norway", "Denmark", "Finland", "Australia", "Japan",
                            "South Korea", "India", "Brazil", "Mexico", "Argentina"
                        ]}
                        error={errors.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />

                    {/* File Picker with multiple file upload */}
                    <FilePicker
                        name="resume"
                        label="Upload Documents (PDF, DOC, DOCX)"
                        value={formData.resume as File | File[] | null}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.resume}
                        schema={{
                            type: 'file',
                            allowedTypes: ['.pdf', '.doc', '.docx', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                            message: 'Please upload valid document files'
                        }}
                        accept=".pdf,.doc,.docx"
                        maxSize={10 * 1024 * 1024} // 10MB limit
                        showFileInfo={true}
                        dragAndDrop={true}
                        multiple={true}
                    />

                    <SubmitButton
                        label="Submit Form"
                    />

                </form>
            </div>
        </div>
    );
}

export default App;
