import React, { Fragment } from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircleOutline as CheckCircleOutlineIcon } from "@mui/icons-material";

const THEME_COLORS = {
    primary: "#6366f1",
    completed: "rgba(216, 202, 202, 0.2)",
    inactive: "#e7e9ed",
};

const DEFAULT_LABELS = ['Tải file Excel', 'Xác nhận dữ liệu', 'Ghép ảnh sản phẩm', 'Tạo mã CID', 'Tạo sản phẩm'];

const StepIndicator = ({
    step,
    currentStep,
    totalSteps = 5,
    labels = DEFAULT_LABELS,
}: {
    step: number;
    currentStep: number;
    totalSteps?: number;
    labels?: string[];
}) => {
    const index = step - 1;
    const isActive = currentStep === step;
    const isCompleted = currentStep > step;
    const isLast = step === totalSteps;

    return (
        <Fragment>
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", maxWidth: '15%' }}>
                <Box
                    sx={{
                        width: '2vw',
                        height: '2vw',
                        borderRadius: '50%',
                        backgroundColor: isActive
                            ? THEME_COLORS.primary
                            : isCompleted ? THEME_COLORS.completed : THEME_COLORS.inactive,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isActive ? "#ffffff" : "#374151",
                        fontWeight: 600,
                        boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none'
                    }}>
                    {isCompleted ? <CheckCircleOutlineIcon fontSize="medium" /> : step}
                </Box>
                <Typography variant="caption" sx={{
                    mt: 1,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                        ? THEME_COLORS.primary
                        : "#64748b"
                }}>
                    {labels[index]}
                </Typography>
            </Box>
            {!isLast && (
                <Box sx={{ flex: 1, height: 3, maxWidth: '10%', background: isCompleted ? THEME_COLORS.primary : THEME_COLORS.inactive, borderRadius: 2 }} />
            )}
        </Fragment>
    );
};

export default React.memo(StepIndicator);
