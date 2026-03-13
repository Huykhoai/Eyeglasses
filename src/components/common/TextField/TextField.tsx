import React from "react";
interface TextFieldProps {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    disabled?: boolean;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}
const TextField = ({ name, value, onChange, placeholder, props, disabled }: TextFieldProps) => {
    return (
        <input
            className='form-control'
            type="text"
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