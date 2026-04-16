import Button from '@/components/common/Button/Button';
import './AddExcelProduct.css';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {Download as DownloadIcon, Upload as UploadIcon } from '@mui/icons-material';

const AddExcelProduct = () => {
    const navigate = useNavigate();
    return (
        <div className="from-excel-product-container">
            <div className="from-excel-product-header">
                <Box className='d-flex align-items-center gap-2'>
                    <Button
                        variant='outline'
                        onClick={() => {navigate('/product')}}
                    >
                        Quay lại
                    </Button>
                    <Typography variant='h6' sx={{ fontWeight: 'bold' }}>Thêm sản phẩm bằng Excel</Typography>
                </Box>
                <Box className='d-flex align-items-center gap-2'>
                    <Button variant='outline'>
                        <DownloadIcon fontSize='small'/>
                        Tải file mẫu
                    </Button>
                    <Button variant='primary'>
                        <UploadIcon fontSize='small'/>
                        Tải file lên
                    </Button>
                </Box>
            </div>
        </div>
    );
};

export default AddExcelProduct;