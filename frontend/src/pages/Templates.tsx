import { CircularProgress } from "@mui/material";
import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import PageHeader from "../Components/PageHeader/PageHeader";
import QrToast from "../Components/QrToast/QrToast";
import EditIcon from '@mui/icons-material/Edit';
import c from './templates.module.scss';
import { useState } from "react";
import MainButton from "../Components/MainButton/MainButton";
import PartyTemplate from "../Components/Templates/PartyTemplate";
import WeddingTemplate from "../Components/Templates/WeddingTemplate";
import PlanningTemplate from "../Components/Templates/PlanningTemplate";
import { useParams } from "react-router-dom";

//Template container for creating a poll
//handle poll title and description input
//generates qr code and poll
//loads poll template depending on polltype
const Templates = () => {

    const { pollType } = useParams<{ pollType: string }>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [button, setBackButton] = useState<boolean>(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const token = localStorage.getItem('token');

    const handleHeadingChange = (value: string) => {
        setTitle(value);
        setTitleError(value.trim() === '');
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setDescriptionError(value.trim() === '');
    };

    const handleGeneratePoll = async () => {
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();

        if (!trimmedTitle || !trimmedDescription) {
            setTitleError(!trimmedTitle);
            setDescriptionError(!trimmedDescription);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description, pollType, title })
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const responseData = await response.json();
            return responseData.pollID;
        } catch (error) {
            console.error('Error occurred during generate poll:', error);
            return null;
        }
    };

    const handleGenerateQR = async () => {
        setLoading(true);
        try {
            const uuid = await handleGeneratePoll();
            if (!uuid) {
                setLoading(false);
                return;
            }

            const url = `${process.env.REACT_APP_FRONTEND_URL}/polls/${uuid}`;

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr?qrUrl=${encodeURIComponent(url)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                console.error(`Server responded with status ${response.status}: ${response.statusText}`);
                throw new Error('Failed to generate QR code');
            }

            const qrBlob = await response.blob();
            const qrCodeUrl = URL.createObjectURL(qrBlob);
            setQrCodeUrl(qrCodeUrl);
            setBackButton(true);

            const downloadLink = document.createElement('a');
            downloadLink.href = qrCodeUrl;
            downloadLink.download = 'qr_code.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

        } catch (error) {
            console.error('Error in handleGenerateQR:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader heading={"Create a " + pollType + " poll"} />
            <div className={c.template}>
                <p className={c.heading}>
                    1. Select A Fancy Name For Your Poll
                </p>
                <InputField startIcon={<EditIcon className={c.editSVG} />} label={'Heading'} placeholder={'Name of your poll'} onChange={handleHeadingChange} error={titleError} sx={{ marginBottom: '20px' }} />
                <p className='heading'>
                    2. Write A Nice Description
                </p>
                <InputField startIcon={<EditIcon className={c.editSVG} />} label={'Description'} placeholder={'This poll is about...'} onChange={handleDescriptionChange}
                    error={descriptionError}
                    sx={{ marginBottom: '20px' }} />
                <hr />
                <p className={c.heading}>
                    3. Check The Poll
                </p>
                {pollType === 'party' && <PartyTemplate/>}
                {pollType === 'wedding' && <WeddingTemplate/>}
                {pollType === 'planning' && <PlanningTemplate/>}
                <hr />
                <p className={c.heading}>
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                {titleError && <p className={c.error}>Title is required</p>}
                {descriptionError && <p className={c.error}>Description is required</p>}
                <div className={c.generateButton}>
                    {!qrCodeUrl && <GenerateButton onClick={handleGenerateQR} />}
                    {loading && <CircularProgress />}
                    {qrCodeUrl && (
                        <div className="qr-code">
                            <img src={qrCodeUrl} alt="QR Code" />
                        </div>
                    )}
                    <QrToast />
                </div>
                {button &&
                    <div className={c.button}>
                        <center>
                            <MainButton text={"Back to Dashboard"} link={"/dashboard"} />
                        </center>
                    </div>
                }
            </div>
        </>
    );
};

export default Templates;
