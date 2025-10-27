# Debouncing vs Throttling

## Overview

Both `useDebounce` and `useThrottle` are hooks that help optimize performance by limiting function executions, but they work differently.

## useDebounce

**When to use**: Delay execution until the user has stopped performing an action.

**How it works**: Waits for a pause in activity before executing.

### Use Cases:
- **Form validation while typing** ✅ (Currently implemented in your example)
- **Search input** - Wait until user stops typing before searching
- **Save drafts** - Only save after user stops typing for a few seconds
- **API calls** - Delay API requests until user finishes input

### Example in Your App:
```tsx
// Validates 500ms after user stops typing
const debouncedValidate = useDebounce((name, value) => {
    // validate field
}, 500);
```

## useThrottle

**When to use**: Limit execution to once per time period.

**How it works**: Guarantees execution at regular intervals.

### Use Cases:
- **Scroll handlers** - Only execute every 100ms while scrolling
- **Window resize** - Update layout every 200ms instead of on every pixel change
- **Mouse move tracking** - Update cursor position every 50ms
- **Rate-limited API calls** - Make maximum 1 request per second

### Example Usage:
```tsx
// Would validate at most once per 500ms, even if user types continuously
const throttledValidate = useThrottle((name, value) => {
    // validate field
}, 500);
```

## Key Differences

| Feature | Debounce | Throttle |
|---------|----------|----------|
| **When executes** | After delay period ends | During delay period |
| **Execution timing** | Last trigger only | Regular intervals |
| **Use for** | Waiting for completion | Limiting frequency |

## Comparison Example

### User types: "abc" in rapid succession

**Debounce (500ms):**
```
Type "a" -> Start timer
Type "b" -> Reset timer (after 200ms)
Type "c" -> Reset timer (after 200ms)
[Wait 500ms with no input]
-> Execute once
```

**Throttle (500ms):**
```
Type "a" -> Execute immediately
Type "b" -> [Wait...]
Type "c" -> Execute (after 500ms since last)
[Wait 500ms]
```

## Current Implementation in Your App

Your example uses **Debouncing** for form validation, which is the correct choice because:
- It waits for the user to pause typing before validating
- Prevents excessive validation runs
- Provides better UX (doesn't show errors while actively typing)

## Where to Use Throttle in Form Validation

Throttle would be better for:
- **Auto-save** feature - Save form state every 1-2 seconds while typing
- **Character count updates** - Update character counter every 100ms
- **Progress indicators** - Update progress bar regularly

### Example Auto-Save with Throttle:
```tsx
const throttledSave = useThrottle((formData) => {
    // Save to localStorage/backend
    localStorage.setItem('form-draft', JSON.stringify(formData));
}, 2000); // Save every 2 seconds

// Use in handleChange
const handleChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    throttledSave(newData); // Saves regularly
};
```

## Summary

- ✅ **Debounce** (current): Validates after user stops typing
- 🔄 **Throttle**: Would validate at fixed intervals (not ideal for typing validation)
- 🎯 For form validation, Debounce is the right choice!

