import React from "react";
interface TextAreaProps {
    name: string;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}
const TextArea = ({ name, value, onChange, placeholder, props }: TextAreaProps) => {
    return (
        <textarea
            className="form-control"
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            rows={4}
            style={{ resize: "vertical" }}
            {...props}
        />
    );
};
export default React.memo(TextArea);