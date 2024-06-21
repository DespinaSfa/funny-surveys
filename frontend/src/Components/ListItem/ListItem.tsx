import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import "./ListItem.scss";
import QRCodeIcon from '../../images/icon_qr.svg';

const ListItem = ({ title, description } : { title: string,  description: string}) => {
    return (
        <div className="list-item">
            <div className="text">
                <p className="list-title">{title}</p>
                {/* <p className="poll-description">-</p>
                <p className="poll-description">{description}</p> */}
            </div>
            <div className="pollOptions">
                <IconButton aria-label="copy" size="large" sx={{ color: "#ffffff" }}>
                    <FileCopyIcon />
                </IconButton>
                <IconButton aria-label="qr" size="large" sx={{ color: "#ffffff" }}>
                    <img src={QRCodeIcon} alt="QR Code Icon"/>
                </IconButton>
                <IconButton aria-label="delete" size="large" sx={{ color: "#ffffff" }}>
                    <ArrowForwardIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default ListItem;
