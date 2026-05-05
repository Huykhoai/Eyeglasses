import React from "react";

interface CardComponentProps {
    icon: string;
    title: string;
    value: string | number;
}

const CardComponent = ({ icon, title, value }: CardComponentProps) => {
    return (
        <div className="detail-field p-3 bg-light rounded">
            <div className="detail-field__label text-muted mb-1 d-flex align-items-center">
                <i className={`${icon} me-2`}></i>
                {title}
            </div>
            <div className="detail-field__value fw-semibold">{value}</div>
        </div>
    );
};

export default React.memo(CardComponent);