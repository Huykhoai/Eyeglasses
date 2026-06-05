import React, { useState } from "react";
import { Error as ErrorIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Chip } from "@mui/material";
import type { RowValidationResult } from "../Config/types";

const ErrorRow = ({ result }: { result: RowValidationResult }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="error-row-card">
            <div className="error-row-header" onClick={() => setExpanded(!expanded)}>
                <div className="d-flex align-items-center gap-2">
                    <ErrorIcon fontSize="small" sx={{ color: '#e74c3c' }} />
                    <span className="error-row-title">Dòng {result.rowIndex}</span>
                    <Chip label={`${result.errors.length} lỗi`} size="small" color="error" variant="outlined" />
                    <span className="error-row-name">{result.dto?.name || '(Trống)'}</span>
                </div>
                {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </div>
            {expanded && (
                <ul className="error-row-list">
                    {result.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default React.memo(ErrorRow);
