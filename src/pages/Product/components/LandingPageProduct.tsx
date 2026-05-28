import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import "./LandingPageProduct.css";
const url = import.meta.env.VITE_API_URL;

const PublicProductByQr = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("details");
    const [product, setProduct] = useState<any>({});


    const switchTab = (tabId: string) => {
        setActiveTab(tabId);
    };


    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${url}/api/public/product/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    }, [id]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <div className="product-page">
                <div className="product-header">
                    <div className="product-image-qr">
                        <img
                            src={`${url}${product.imgUrl}`}
                            alt="Product"
                            className="image"
                        />
                    </div>
                    <div className="product-info">
                        <div className="product-title">{product.name}</div>
                        <div className="product-price">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(product.price || 0)}
                        </div>
                        <div className="product-desc">
                            <strong>Thương hiệu : </strong> {product.tradeMark || "Đang cập nhật"}
                        </div>
                        <div className="product-desc">
                            <strong>Mô tả : </strong>
                            {product.description}
                        </div>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === "details" ? "active" : ""}`}
                        onClick={() => switchTab("details")}
                    >
                        Mô tả
                    </button>
                    <button
                        className={`tab-button ${activeTab === "features" ? "active" : ""}`}
                        onClick={() => switchTab("features")}
                    >
                        Thông tin
                    </button>

                    <button
                        className={`tab-button ${activeTab === "guides" ? "active" : ""}`}
                        onClick={() => window.location.href = "https://vnoptictech.com.vn/"}
                    >
                        Sản phẩm khác
                    </button>
                </div>

                <div
                    id="details"
                    className={`tab-content ${activeTab === "details" ? "active" : ""}`}
                >
                    <div className="section-title">Mô tả sản phẩm</div>
                    <div className="section-content">
                        <div className="info-block">
                            <div className="block-header">
                                <div className="block-title">THÔNG TIN SẢN PHẨM</div>
                            </div>
                            <div className="block-desc">Thông số & Cấu hình</div>
                            {product.group === "OPT" ? (
                                <ul>
                                    <li><strong>Model:</strong> {product.opt?.model || "Đang cập nhật"}</li>
                                    <li><strong>Mã màu:</strong> {product.opt?.color || "Đang cập nhật"}</li>
                                    <li><strong>Mã kính:</strong> {product.cid || "Đang cập nhật"}</li>
                                    <li><strong>Xuất xứ:</strong> {product.country || "Đang cập nhật"}</li>
                                    <li><strong>Vật liệu:</strong>
                                        <div><strong>Mặt trước: </strong> {product.opt?.materialFont || "Đang cập nhật"} ,
                                            <strong> Càng:</strong> {product.opt?.materialTemp || "Đang cập nhật"}
                                        </div>
                                    </li>
                                    <li><strong>Kích thước:</strong>
                                        <div className="product-dim">
                                            <img src="/daimat.png" alt="Dài mắt" className="dim-icon" />
                                            <strong>Dài mắt: </strong> {product.opt?.lensWidth ? `${product.opt.lensWidth} mm` : "Đang cập nhật"}
                                        </div>
                                        <div className="product-dim">
                                            <img src="/daicau.png" alt="Dài cầu" className="dim-icon" />
                                            <strong>Dài cầu: </strong> {product.opt?.bridgeWidth ? `${product.opt.bridgeWidth} mm` : "Đang cập nhật"}
                                        </div>
                                        <div className="product-dim">
                                            <img src="/daicang.png" alt="Dài càng" className="dim-icon" />
                                            <strong>Dài càng: </strong> {product.opt?.templeWidth ? `${product.opt.templeWidth} mm` : "Đang cập nhật"}
                                        </div>
                                    </li>
                                </ul>
                            ) : (
                                <div className="product-info-row">
                                    <ul>
                                        <li><strong>Mã kính:</strong> {product.cid || "Đang cập nhật"}</li>
                                        <li><strong>Xuất xứ:</strong> {product.country || "Đang cập nhật"}</li>
                                        <li><strong>Phân loại:</strong> {product.group || "Đang cập nhật"}</li>
                                        <li><strong>Chiết suất:</strong> {product.len?.lensIndex || "Đang cập nhật"}</li>
                                        <li><strong>Vật liệu:</strong> Nhựa</li>
                                    </ul>
                                    <ul>
                                        <li><strong>SPH:</strong> {product.len?.sph || ""}</li>
                                        <li><strong>CYL:</strong> {product.len?.cyl || ""}</li>
                                        <li><strong>ADD:</strong> {product.len?.add || ""}</li>
                                        <li><strong>Đường kính:</strong> {product.len?.diameter || "Đang cập nhật"}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="section-content" style={{ marginTop: "20px" }}>
                        <div className="info-block">
                            <div className="block-header">
                                <div className="block-title">THÔNG TIN SỬ DỤNG</div>
                            </div>
                            <div className="block-desc">Thông tin bổ sung về sản phẩm</div>
                            <ul>
                                <li><b>Thông tin bổ sung:</b> {product.note || "Không"}</li>
                                <li><b>Hướng dẫn sử dụng:</b> {product.guide || "Đang cập nhật"}</li>
                                <li><b>Bảo quản:</b> {product.preserve || "Đang cập nhật"}</li>
                                <li><b>Cảnh báo:</b> {product.warning || "Đang cập nhật"}</li>
                                <li><b>Công dụng:</b> {product.uses || "Đang cập nhật"}</li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* TAB: THÔNG TIN */}
                <div
                    id="features"
                    className={`tab-content ${activeTab === "features" ? "active" : ""}`}
                >
                    <div className="section-title">Thông tin chung</div>
                    <div className="info-blocks">
                        <div className="info-block">
                            <div className="block-header">
                                <div className="block-title">CÔNG TY TNHH CÔNG NGHỆ QUANG HỌC VIỆT NAM</div>
                            </div>
                            <div className="block-desc">Nhà sản xuất / nhập khẩu </div>
                            <ul>
                                <li>Số 63 Lê Duẩn, Phường Cửa Nam, Quận Hoàn Kiếm, TP. Hà Nội, Việt Nam</li>
                            </ul>
                        </div>

                        {product.supplierName && (
                            <div className="info-block">
                                <div className="block-header">
                                    <div className="block-title">{product.supplierName}</div>
                                </div>
                                <div className="block-desc">Nhà cung cấp / Xuất khẩu</div>
                                <ul>
                                    <li>{product.supplierAddress || "Đang cập nhật"}</li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default PublicProductByQr;
