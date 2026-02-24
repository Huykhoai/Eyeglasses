import React, { type SelectHTMLAttributes } from 'react';
import './Select.css';

interface Option {
    label: string;
    value: string | number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: Option[];
}

const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => {
    return (
        <div className="select-container">
            <select className={`select-base ${className}`} {...props}>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <svg className="select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </div>
    );
};

export default React.memo(Select);
