import { Avatar, Box, IconButton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
const BASE_URL = import.meta.env.VITE_API_URL;
const PRIMARY_COLOR = import.meta.env.VITE_PRIMARY_COLOR;
const SECONDARY_COLOR = import.meta.env.VITE_SECOND_COLOR;

const AvatarUI = ({ onImageChange }: { onImageChange: (file: File | null) => void }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { control } = useFormContext();
    const imageUrl = useWatch({ control, name: 'employeeInformation.imageUrl' })

    useEffect(() => {
        if (imageUrl) {
            const fullUrl = imageUrl.startsWith('/images/')
                ? `${BASE_URL}${imageUrl}`
                : imageUrl;
            setPreviewUrl(fullUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [imageUrl]);
    const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onImageChange(file);
        }
    }, [onImageChange])

    const onContainerClick = useCallback(() => {
        fileInputRef.current?.click();
    }, [])

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, [setIsDragging])

    const onDragLeave = useCallback(() => {
        setIsDragging(false);
    }, [setIsDragging])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onImageChange(file);
        }
    }, [onImageChange])

    return (
        <Box
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <Avatar
                src={previewUrl || undefined}
                sx={{
                    width: { xs: "20vw", md: "10vw" },
                    height: { xs: "20vw", md: "10vw" },
                    border: isDragging ? '2px dashed #6366f1' : '4px solid white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    mb: 2
                }}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <label htmlFor="icon-button-file">
                <IconButton
                    onClick={onContainerClick}
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    sx={{
                        position: 'absolute',
                        bottom: 35,
                        right: 5,
                        bgcolor: PRIMARY_COLOR,
                        color: 'white',
                        border: '3px solid white',
                        '&:hover': {
                            bgcolor: SECONDARY_COLOR,
                        }
                    }}
                >
                    <CameraAltIcon sx={{ width: 15, height: 15 }} />
                </IconButton>
            </label>
        </Box>
    )
}
export default React.memo(AvatarUI)