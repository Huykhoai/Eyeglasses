import React, { useMemo } from "react";
import { useTouchMoveTable } from "@/utils/touchMoveTable";
import { Typography } from "@mui/material";
import type { TableProductFrameProps } from "../Config/types";
import { columnsFrame } from "../Config/Columns";

const TableProductFrame: React.FC<TableProductFrameProps> = ({ rows, imagePreviewMap, categoryMaps }) => {
    const { tableRef, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchMoveTable();
    const columnsData = useMemo(() => columnsFrame(imagePreviewMap, categoryMaps), [imagePreviewMap, categoryMaps]);

    return (
        <div className="table-scroll-container" style={{ height: 'calc(100vh - 200px)', padding: 0 }}
            ref={tableRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <table className="table-premium">
                <thead>
                    <tr>
                        {columnsData.map((col) => (
                            <th key={col.key} style={{ minWidth: col.width }}>
                                <Typography variant="subtitle2" fontSize={11} fontWeight={700} align='center'>
                                    {col.header}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.rowIndex}>
                            {columnsData.map((col) => (
                                <td key={col.key} style={{ maxWidth: col.width, textAlign: col.align || 'left' }}>
                                    {col.render ? col.render(row, index) : ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(TableProductFrame);
