import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import type { DepartmentType } from "./type";

export const useColumns: ColumnDef[] = [
    {
        key: 'cid',
        header: 'Mã phòng ban',
        render: (item: DepartmentType) => (
            <Typography className="badge-chip badge-info" variant="body2" fontSize={12} fontWeight={600}>
                {item.cid}
            </Typography>
        )
    },
    {
        key: 'name',
        header: 'Tên phòng ban',
        render: (item: DepartmentType) => (
            <Typography variant="body2" fontSize={12}>
                {item.name}
            </Typography>
        )
    },
    {
        key: 'location',
        header: 'Địa điểm',
        render: (item: DepartmentType) => (
            <Typography variant="body2" fontSize={12}>
                {item.location}
            </Typography>
        )
    },
    {
        key: 'manager',
        header: 'Trưởng phòng',
        render: (item: DepartmentType) => (
            <Typography variant="body2" fontSize={12}>
                {item.manager?.name || '-'}
            </Typography>
        )
    }
]