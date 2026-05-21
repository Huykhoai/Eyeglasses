import type { ColumnDef } from "@/types";
import { Typography } from "@mui/material";
import type { OtkItemResponse } from "./otkTypes";
import TextField from "@/components/common/TextField/TextField";
import DeliveryEnum, { DeliveryEnumLabel } from "@/utils/DeliveryEnum";

export const columnsOtkInspection = (
    selectedItems: Map<number, any>,
    handleItemChange: (item: OtkItemResponse, field: string, value: any) => void,
): ColumnDef[] => [
        {
            key: 'contractCid',
            header: 'Hợp đồng',
            width: '9vw',
            align: 'center',
            render: (item: OtkItemResponse) => (
                <span className="badge-chip badge-info" style={{ fontSize: 10 }}>{item.contractCid}</span>
            )
        },
        {
            key: 'cid',
            header: 'Mã SP',
            width: '8vw',
            align: 'center',
            render: (item: OtkItemResponse) => (
                <span className="badge-chip badge-neutral" style={{ fontSize: 10 }}>{item.cid}</span>
            )
        },
        {
            key: 'name',
            header: 'Tên SP',
            width: '15vw',
            align: 'left',
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={11} align="left">
                    {item.name}
                </Typography>
            )
        },
        {
            key: 'status',
            header: 'Trạng thái',
            width: '7vw',
            align: 'center',
            render: (item: OtkItemResponse) => {
                const status = DeliveryEnumLabel[item.status];
                let badge = "";
                switch(item.status){
                    case DeliveryEnum.NOT_CHECKED:
                        badge = "badge-neutral";
                        break;
                    case DeliveryEnum.CHECKING:
                        badge = "badge-warning";
                        break;
                    case DeliveryEnum.CHECKED:
                        badge = "badge-success";
                        break;
                }
                return (
                    <span className={`badge-chip ${badge}`} style={{ fontSize: 10 }}>
                        {status}
                    </span>
                )
            }
        },
        {
            key: 'scheduledQty',
            header: 'SL kế hoạch',
            width: '5vw',
            align: 'center',
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={11} align="center">
                    {item.scheduledQty}
                </Typography>
            )
        },
        {
            key: 'otkQty',
            header: 'SL OTK',
            width: '5vw',
            align: 'center',
            render: (item: OtkItemResponse) => (
                <Typography variant="body2" fontSize={11} align="center" fontWeight={600}>
                    {item.otkQty || 0}
                </Typography>
            )
        },
        {
            key: 'acceptedQty',
            header: 'Đạt',
            width: '6vw',
            align: 'center',
            render: (item: OtkItemResponse) => {
                const isSelected = selectedItems.has(item.deliveryItemId);
                if (isSelected) {
                    return (
                        <TextField
                            name="acceptedQty"
                            isNumber
                            value={selectedItems.get(item.deliveryItemId)?.acceptedQty}
                            onChange={(e) => handleItemChange(item, 'acceptedQty', e.target.value)}
                            props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
                        />
                    );
                }
                return (
                    <Typography variant="body2" fontSize={11} align="center" color="success.main" fontWeight={600}>
                        {selectedItems.get(item.deliveryItemId)?.acceptedQty ?? item.acceptedQty}
                    </Typography>
                );
            }
        },
        {
            key: 'deniedQty',
            header: 'Không đạt',
            width: '6vw',
            align: 'center',
            render: (item: OtkItemResponse) => {
                const isSelected = selectedItems.has(item.deliveryItemId);
                if (isSelected) {
                    return (
                        <TextField
                            name="deniedQty"
                            isNumber
                            value={selectedItems.get(item.deliveryItemId)?.deniedQty}
                            onChange={(e) => handleItemChange(item, 'deniedQty', e.target.value)}
                            props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
                        />
                    );
                }
                return (
                    <Typography variant="body2" fontSize={11} align="center" color="error.main" fontWeight={600}>
                        {selectedItems.get(item.deliveryItemId)?.deniedQty ?? item.deniedQty}
                    </Typography>
                );
            }
        },
        {
            key: 'extraQty',
            header: 'Thừa',
            width: '6vw',
            align: 'center',
            render: (item: OtkItemResponse) => {
                const isSelected = selectedItems.has(item.deliveryItemId);
                if (isSelected) {
                    return (
                        <TextField
                            name="extraQty"
                            isNumber
                            value={selectedItems.get(item.deliveryItemId)?.extraQty}
                            onChange={(e) => handleItemChange(item, 'extraQty', e.target.value)}
                            props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}
                        />
                    );
                }
                return (
                    <Typography variant="body2" fontSize={11} align="center" color="warning.main" fontWeight={600}>
                        {selectedItems.get(item.deliveryItemId)?.extraQty ?? item.extraQty}
                    </Typography>
                );
            }
        },
        {
            key: 'lostQty',
            header: 'Thiếu',
            width: '6vw',
            align: 'center',
            render: (item: OtkItemResponse) => {
                const isSelected = selectedItems.has(item.deliveryItemId);
                if (isSelected) {
                    return (
                        <TextField
                            name="lostQty"
                            isNumber
                            value={selectedItems.get(item.deliveryItemId)?.lostQty}
                            onChange={(e) => handleItemChange(item, 'lostQty', e.target.value)}
                            props={{ min: 0, style: { textAlign: 'right', width: '5vw', padding: '3px 8px' } }}

                        />
                    );
                }
                return (
                    <Typography variant="body2" fontSize={11} align="center" color="info.main" fontWeight={600}>
                        {selectedItems.get(item.deliveryItemId)?.lostQty ?? item.lostQty}
                    </Typography>
                );
            }
        },
        {
            key: 'note',
            header: 'Ghi chú',
            width: '10vw',
            align: 'left',
            render: (item: OtkItemResponse) => {
                const isSelected = selectedItems.has(item.deliveryItemId);
                if (isSelected) {
                    return (
                        <TextField
                            name="note"
                            value={selectedItems.get(item.deliveryItemId)?.note || ''}
                            onChange={(e) => handleItemChange(item, 'note', e.target.value)}
                            placeholder="Ghi chú..."
                            props={{ style: { textAlign: 'left', width: '10vw', padding: '3px 8px' } }}
                        />
                    );
                }
                return (
                    <Typography variant="body2" fontSize={11}>
                        {selectedItems.get(item.deliveryItemId)?.note ?? item.note ?? '-'}
                    </Typography>
                );
            }
        }
    ];
