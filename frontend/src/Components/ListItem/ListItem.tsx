import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import "./ListItem.scss";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Tooltip } from '@mui/material';

const ListItem = ({ title, description, id } : { title: string,  description: string, id: String}) => {
    const token = localStorage.getItem("token")
    const color = '#ffffff'
    const onHoverColor = '#887EF1'

    const deletePoll = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
        } catch (error) {
            console.error('Error occurred during generate poll:', error);
        }
        window.location.reload()
    };

    const copyLink = () => {
        const url = `${process.env.REACT_APP_FRONTEND_URL}/polls/${id}`

        navigator.clipboard.writeText(url).then(() => {
            alert('URL copied to clipboard!');
          }).catch((error) => {
            console.error('Error copying URL: ', error);
          });
    };

    const downloadQRCode = () => {

     }

    const navigateToResults = () => {
        window.location.href = `/results/${id}`;
    };

    return (
        <div className="list-item">
            <div className="text">
                <p className="list-title">{title}</p>
                {/* <p className="poll-description">-</p>
                <p className="poll-description">{description}</p> */}
            </div>
            <div className="pollOptions">
                <Tooltip title="Delete Poll">
                    <IconButton aria-label="delete" size="large" onClick={deletePoll}  sx={{color: color, '&:hover': {
                            color: '#ff1744',
                        },}}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Copy Link to Poll">
                    <IconButton aria-label="copy" size="large" onClick={copyLink} sx={{ color: color, '&:hover': {
                            color: onHoverColor,
                        }, }}>
                        <FileCopyIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download QR Code">
                    <IconButton aria-label="qr" size="large" onClick={downloadQRCode} sx={{ color: color, '&:hover': {
                            color: onHoverColor,
                        }, }}>
                        <QrCodeScannerIcon/>
                    </IconButton>
                </Tooltip>
                <IconButton aria-label="seeResults" size="large" onClick={navigateToResults} sx={{ color: color, '&:hover': {
                        color: onHoverColor,
                    }, }}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default ListItem;
