import { ValidationFunction } from "../utils";

interface StyleProps {
    container?: string;
    label?: string;
    dropdownTrigger?: string;
    input?: string;
    dropdownList?: string;
    option?: string;
    errorText?: string;
}

export interface DropDownProps {
    name: string;
    label: string;
    value: string;
    options: string[];
    error: string | null;
    onChange: (name: string, value: string) => void;
    onBlur: (
        name: string,
        value: string,
        validator?: ValidationFunction | ValidationFunction[]
    ) => void;
    styleProps?: StyleProps;
}
