import React, { useCallback, useRef } from "react";
import type { ImageMapping } from "../Config/types";
import { Check as CheckIcon, Delete as DeleteIcon, Image as ImageIcon, Info as InfoIcon, Warning as WarningIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const ImageMapCard = ({
    mapping,
    onFileSelect,
    onRemove,
}: {
    mapping: ImageMapping;
    onFileSelect: (name: string, file: File) => void;
    onRemove: (name: string) => void;
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const isMatched = mapping.file && mapping.name.includes(mapping.file.name);
    const isUnmatched = mapping.file && !mapping.name.includes(mapping.file.name);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                onFileSelect(mapping.name, file);
            }
        },
        [mapping.name, onFileSelect]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(mapping.name, file);
        e.target.value = '';
    };

    return (
        <div
            className={`image-map-card 
                ${isMatched
                    ? 'image-map-card--matched'
                    : isUnmatched
                        ? 'image-map-card--unmatched'
                        : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleChange}
            />
            {mapping.previewUrl ? (
                <div className="image-map-preview">
                    <img src={mapping.previewUrl} alt={mapping.name} />
                    <IconButton
                        size="small"
                        className="image-map-remove"
                        onClick={() => onRemove(mapping.name)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </div>
            ) : (
                <div
                    className="image-map-dropzone"
                    onClick={() => inputRef.current?.click()}
                >
                    <ImageIcon sx={{ fontSize: 32, color: 'var(--color-primary-light)' }} />
                    <span>Kéo thả hoặc nhấn chọn</span>
                </div>
            )}
            <div className="image-map-name">
                {isMatched ? <CheckIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    : isUnmatched ? <WarningIcon fontSize="small" sx={{ color: '#999' }} />
                        : <InfoIcon fontSize="small" sx={{ color: '#999' }} />}
                <span title={mapping.name}>{mapping.name}</span>
            </div>
        </div>
    );
};
export default React.memo(ImageMapCard);
