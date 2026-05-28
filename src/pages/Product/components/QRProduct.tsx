import { QRCodeCanvas } from "qrcode.react";

const QrProduct = ({ id }: { id: number }) => {
    const url = window.location.origin;

    if (!id) {
        return <p>Không có dữ liệu</p>;
    }

    return (
        <div className="d-flex flex-column align-items-center">
            <QRCodeCanvas
                id="qrCanvas"
                value={`${url}/product/${id}`} 
                size={40}
            />
        </div>
    );
};

export default QrProduct;
