import React from "react";
interface TextFieldProps {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    type?: React.HTMLInputTypeAttribute;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}
const TextField = ({ name, value, onChange, placeholder, props, disabled, type }: TextFieldProps) => {
    return (
        <input
            className='form-control'
            type={type ?? "text"}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
        />
    );
};
export default React.memo(TextField);