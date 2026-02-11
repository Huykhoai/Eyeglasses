const Unauthorized = () => {
    return (
        <div className="container mt-5 text-center">
            <h1 className="text-danger">403 - Không có quyền truy cập</h1>
            <p className="lead">Xin lỗi, bạn không có quyền truy cập vào chức năng này của phòng ban khác.</p>
            <button
                className="btn btn-primary"
                onClick={() => window.location.href = '/dashboard'}
            >
                Quay lại Dashboard
            </button>
        </div>
    );
};

export default Unauthorized;
