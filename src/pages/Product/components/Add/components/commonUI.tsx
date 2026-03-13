import React from "react";

export const LayoutGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr 3fr', alignItems: 'center' }}>
            {children}
        </div>
    );
};
export const Label = ({ label }: { label: string }) => {
    return (
        <div className='d-flex gap-1'>
            <span style={{ fontWeight: 'bold' }}>{label}</span>
            <span style={{ color: 'red' }}>*</span>
        </div>
    );
};

