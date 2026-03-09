import React from "react";

const TextField = ({ name, value, onChange, placeholder, props }: { name: string, value: any, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, props?: React.InputHTMLAttributes<HTMLInputElement> }) => {
    return (
        <input
            className='form-control'
            type="text"
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            {...props}
        />
    );
};
export default React.memo(TextField);