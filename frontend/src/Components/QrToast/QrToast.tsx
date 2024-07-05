import { useState } from 'react';
import { Snackbar, Box, Button } from '@mui/material';
// import QRCode from 'qrcode.react';  
import c from "./qrToast.module.scss";
import MainButton from '../../Components/MainButton/MainButton';

//Qr-Code popup
//contains button which navigates back to dashboard
const QrToast = () => {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    function handleBack() {
        window.location.href = '/dashboard';
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={open}
                autoHideDuration={null} 
                onClose={handleClose}
                ContentProps={{
                    className: c.snackbarContent,
                    onClick: (event) => {
                        event.stopPropagation();
                    },
                }}
                message={
                    <Box className={c.toastContent}>
                        <h2>Your QR Code</h2>
                        {/* <QRCode className={c.qrCodeWrapper} value={qrValue} /> */}
                        <div className={c.toastButtons}>
                            <Button variant="outlined" className={c.backToDashboardButton} onClick={handleBack}>Back To Dashboard</Button>
                            <MainButton text="Save" onClick={handleClose} />
                        </div>
                    </Box>
                }
            />

        </>
    );
};

export default QrToast;
