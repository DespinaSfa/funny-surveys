import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import "./ListItem.scss";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

const ListItem = ({ title, description, id } : { title: string,  description: string, id: String}) => {
    const token = localStorage.getItem("token")
    const color = '#ffffff'
    const onHoverColor = '#887EF1'

    const deletePoll = async () => {
        try {
            const response = await fetch('http://localhost:3001/polls/'+id, {
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
                <IconButton aria-label="delete" size="large" onClick={deletePoll}  sx={{color: color, '&:hover': {
                        color: '#ff1744',
                    },}}>
                    <DeleteIcon/>
                </IconButton>
                <IconButton aria-label="copy" size="large" sx={{ color: color, '&:hover': {
                        color: onHoverColor,
                    }, }}>
                    <FileCopyIcon />
                </IconButton>
                <IconButton aria-label="qr" size="large" sx={{ color: color, '&:hover': {
                        color: onHoverColor,
                    }, }}>
                    <QrCodeScannerIcon/>
                </IconButton>
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
