import type { ColumnDef } from "@/types";
import type { EmployeeType } from "./type";
import { Tooltip, Typography } from "@mui/material";
const url = import.meta.env.VITE_API_URL;
export const useColumns: (ColumnDef & { groupName?: string })[] = [
    {
        key: 'cid',
        header: 'Mã NV',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.cid}</span>
        )
    },
    {
        key: 'imageUrl',
        header: 'Ảnh',
        align: 'center',
        width: '5vw',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <img
                src={url + item.employeeInformation?.imageUrl}
                alt={item.name}
                style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                }}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = '/avatar_default.jpg';
                }}
            />
        )
    },
    {
        key: 'name',
        header: 'Họ và tên',
        align: 'left',
        width: '6vw',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.name}
            </Typography>
        ),
    },
    {
        key: 'workEmail',
        header: 'Email',
        align: 'left',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.email}
            </Typography>
        )
    },
    {
        key: 'department',
        header: 'Phòng ban',
        align: 'left',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="left">
                {item.department?.name || '-'}
            </Typography>
        )
    },
    {
        key: 'numberOfDependents',
        header: 'Quân số',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.numberOfDependents}
            </Typography>
        )
    },
    {
        key: 'hasAccount',
        header: 'Tài khoản',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => (
            <span className={`badge-chip badge-${item.hasAccount ? 'success' : 'danger'}`}>
                {item.hasAccount ? 'Có' : 'Không'}
            </span>
        )
    },
    {
        key: 'status',
        header: 'Trạng thái',
        align: 'center',
        groupName: 'Thông tin chung',
        render: (item: EmployeeType) => {
            const name = item.statusEm?.name || '-';
            const status = item.statusEm?.id === 1 ? 'success' : item.statusEm?.id === 2 || item.statusEm?.id === 3 ? 'warning' : 'danger';
            return (
                <span className={`badge-chip badge-${status}`}>
                    {name}
                </span>
            );
        }
    },
    {
        key: 'personalEmail',
        header: 'Email cá nhân',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.email || '-'}
            </Typography>
        )
    }, {
        key: 'phone',
        header: 'Số điện thoại',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.phone || '-'}
            </Typography>
        )
    },
    {
        key: 'gender',
        header: 'Giới tính',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.gender === false ? 'Nam' : item.employeeInformation?.gender === true ? 'Nữ' : '-'}
            </Typography>
        )
    },
    {
        key: 'address',
        header: 'Địa chỉ',
        align: 'center',
        width: '12vw',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Tooltip title={item.employeeInformation?.address || '-'}>
                <Typography variant="body2" fontSize={11}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'left',
                    }}>
                    {item.employeeInformation?.address || '-'}
                </Typography>
            </Tooltip>
        )
    },
    {
        key: 'dateOfBirth',
        header: 'Ngày sinh',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.dateOfBirth ? new Date(item.employeeInformation?.dateOfBirth).toLocaleDateString('vi-VN') : '-'}
            </Typography>
        )
    },
    {
        key: 'citizenIdentificationNumber',
        header: 'Số CCCD',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.citizenIdentificationNumber || '-'}
            </Typography>
        )
    },
    {
        key: 'accountNo',
        header: 'Số tài khoản',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.accountNo || '-'}
            </Typography>
        )
    },
    {
        key: 'bankName',
        header: 'Ngân hàng',
        align: 'center',
        groupName: 'Thông tin riêng',
        render: (item: EmployeeType) => (
            <Typography variant="body2" fontSize={11} align="center">
                {item.employeeInformation?.bankName || '-'}
            </Typography>
        )
    }
];