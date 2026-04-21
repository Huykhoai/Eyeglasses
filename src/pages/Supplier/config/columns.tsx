import { Typography } from "@mui/material";
import type { ColumnDef } from "@/types";
import type { Supplier } from "./type";

export const columns: ColumnDef[] = [
    {
        key: 'cid',
        header: 'Mã NCC',
        width: '5vw',
        render: (item: Supplier) => (
            <Typography className="badge-chip badge-info" variant="body2" fontSize={12} fontWeight={600}>
                {item.cid}
            </Typography>
        ),
    },
    {
        key: 'name',
        header: 'Tên nhà cung cấp',
        width: '15vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.name}
            </Typography>
        ),
    },
    {
        key: 'phone',
        header: 'Số điện thoại',
        width: '8vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.phone}
            </Typography>
        ),
    },
    {
        key: 'email',
        header: 'Email',
        width: '12vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.email}
            </Typography>
        ),
    },
    {
        key: 'address',
        header: 'Địa chỉ',
        width: '24vw',
        render: (item: Supplier) => (
            <Typography
                variant="body2"
                fontSize={12}
                sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                {item.address}
            </Typography>
        ),
    },
    {
        key: 'contact',
        header: 'Liên hệ',
        width: '6vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.contact}
            </Typography>
        ),
    },
    {
        key: 'country',
        header: 'Quốc gia',
        width: '6vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.country.name}
            </Typography>
        ),
    },
    {
        key: 'taxCode',
        header: 'Mã số thuế',
        width: '10vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.taxCode}
            </Typography>
        ),
    },
    {
        key: 'advisingBank',
        header: 'Ngân hàng',
        width: '12vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.advisingBank}
            </Typography>
        ),
    },
    {
        key: 'accountNo',
        header: 'Số tài khoản',
        width: '12vw',
        render: (item: Supplier) => (
            <Typography variant="body2" fontSize={12}>
                {item.accountNo}
            </Typography>
        ),
    },
];