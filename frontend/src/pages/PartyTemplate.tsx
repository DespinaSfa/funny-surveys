import { CircularProgress } from "@mui/material";
import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
import PageHeader from "../Components/PageHeader/PageHeader";
import QrToast from "../Components/QrToast/QrToast";
import RangeSelector from "../Components/RangeSelector";
import EditIcon from '@mui/icons-material/Edit';
import './template.scss'; 
import { useState } from "react";
import MainButton from "../Components/MainButton/MainButton";
import c from '../Components/PollHeader/PollHeader.module.scss';


const PartyTemplate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [button, setBackButton] = useState<boolean>(false);
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const pollType = "party";
    const token = localStorage.getItem('token');
    const options = ['Dancing 💃', 'Shout along to party hits or karaoke 🎤', 'PartyGames (Bierpong, Rage-Cage, etc.) 🍻 ', 'Chilling and chatting a bit outside with friends 🗨️'];

    const handleHeadingChange = (value: string) => {
        setTitle(value);
        setTitleError(value === '');
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setDescriptionError(value === '');
    };

    const handleGeneratePoll = async () => {
        if (!title || !description) {
            setTitleError(!title);
            setDescriptionError(!description);
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
            <PageHeader heading="Create Party Poll" />
            <div className="template">
            <p className={c.heading}>
                1. Select A Fancy Name For Your Poll
            </p>
            <InputField startIcon={<EditIcon className={c.personSVG}/>} label={'Heading'} placeholder={'Name of your poll'} onChange={handleHeadingChange} error={titleError} sx={{ marginBottom: '20px' }}/>
            <p className={c.heading}>
                2. Write A Nice Description
            </p>
            <InputField startIcon={<EditIcon className={c.personSVG}/>} label={'Description'} placeholder={'This poll is about...'} onChange={handleDescriptionChange}
                    error={descriptionError} 
                    sx={{ marginBottom: '20px' }}/>
            <hr/>
            <p className={c.heading}>
                3. Check The Poll
            </p>
                <p className="question">Which songs should definitely be played tonight? 📻</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <p className="question">What is your current alcohol level? 📈</p>
                <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
                <RangeSelector min={0} max={5} step={1} disabled={true} onChange={function (value: number): void { }} /> <br />
                <p className="question">What alcohol level have you set as your goal for today? 🍺</p>
                <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
                <RangeSelector min={0} max={5} step={1} disabled={true} onChange={function (value: number): void { }} /><br />
                <p className="question">What is your favorite party activity?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {options.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className="question">Which snacks or drinks would you like for the next party? 🍔</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <hr />
                <p className="heading">
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                {titleError && <p className="error">Title is required</p>}
                {descriptionError && <p className="error">Description is required</p>}
                <div className="generateButton">
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
                    <div className={"button"}>
                        <center>
                            <MainButton text={"Back to Dashboard"} link={"/dashboard"} />
                        </center>
                    </div>
                }
            </div>
        </>
    );
};

export default PartyTemplate;
