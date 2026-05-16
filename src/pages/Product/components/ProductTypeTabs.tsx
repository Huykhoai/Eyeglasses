import React from 'react';
import type { ProductType } from '../types/product';

interface ProductTypeTabsProps {
    value: ProductType;
    onChange: (type: ProductType) => void;
}

const tabs: { type: ProductType; label: string }[] = [
    { type: 'LENS', label: 'Mắt kính' },
    { type: 'FRAME', label: 'Gọng kính' },
];

const ProductTypeTabs: React.FC<ProductTypeTabsProps> = ({ value, onChange }) => {
    return (
        <div className="product-type-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.type}
                    className={`product-type-tab ${value === tab.type ? 'active' : ''}`}
                    onClick={() => onChange(tab.type)}
                >
                    <span className="tab-label">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default React.memo(ProductTypeTabs);
