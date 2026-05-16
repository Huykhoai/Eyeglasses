import React, { useState, useRef, useEffect, useCallback } from 'react';
import Button from '@/components/common/Button/Button';
import AddIcon from '@mui/icons-material/Add';

interface AddProductMenuProps {
    title?: string
    onAdd: () => void;
    onBulkAdd: () => void;
    disabled?: boolean;
}

const AddProductMenu: React.FC<AddProductMenuProps> = ({title= "Thêm sản phẩm", onAdd, onBulkAdd, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClickOutside]);

    return (
        <div className="add-product-menu" ref={containerRef}>
            <Button
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                icon={<AddIcon fontSize="small" />}
            >
                {title}
                <svg
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{
                        marginLeft: 4,
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </Button>

            {isOpen && (
                <div className="add-menu-dropdown">
                    <div
                        className="add-menu-item"
                        onClick={() => { onAdd(); setIsOpen(false); }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Thêm thủ công
                    </div>
                    <div
                        className="add-menu-item"
                        onClick={() => { onBulkAdd(); setIsOpen(false); }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="12" y1="18" x2="12" y2="12" />
                            <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                        Thêm nhiều (Excel)
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(AddProductMenu);
