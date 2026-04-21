import React, { useEffect, useState } from "react";
interface TextFieldProps {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: React.HTMLInputTypeAttribute;
    isNumber?: boolean;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}
const TextField = ({ name, value, onChange, placeholder, props, disabled, type = "text", isNumber = false }: TextFieldProps) => {
    const [localValue, setLocalValue] = useState(value ?? '');

    useEffect(() => {
        setLocalValue(value ?? '');
    }, [value]);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (onChange && e.target.value !== String(value ?? '')) {
            if (isNumber) {
                const regex = /^[0-9]*$/;
                if (regex.test(e.target.value)) {
                    onChange(e);
                } else {
                    onChange({ ...e, target: { ...e.target, value: '0' } });
                }
            } else {
                onChange(e);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <input
            {...props}
            type={type}
            name={name}
            className={`form-control ${props?.className || ''}`}
            value={localValue}
            onChange={handleOnChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
};
export default React.memo(TextField);