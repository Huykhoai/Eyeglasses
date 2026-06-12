import Button from "@/components/common/Button/Button";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackupIcon from '@mui/icons-material/Backup';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
interface ExcelMenuProps {
    title?: string
    onImport: () => void;
    onExport: () => void;
    disabled?: boolean;
}

const ExcelMenu = ({ title, onImport, onExport, disabled }: ExcelMenuProps) => {
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
                icon={<CloudSyncIcon fontSize="small" />}
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
                        onClick={() => { onImport(); setIsOpen(false); }}
                    >
                        <CloudDownloadIcon fontSize="small" />
                        Nhập Excel
                    </div>
                    <div
                        className="add-menu-item"
                        onClick={() => { onExport(); setIsOpen(false); }}
                    >
                        <BackupIcon fontSize="small" />
                        Xuất Excel
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(ExcelMenu);