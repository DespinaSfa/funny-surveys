import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import './template.scss';
import { useEffect, useState } from "react";
import {CircularProgress} from "@mui/material";
import QrToast from "../Components/QrToast/QrToast";
import MainButton from "../Components/MainButton/MainButton";

const PlanningTemplate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [backButton , setBackButton] = useState<boolean>(false);
    const pollType = "party";
    const token = localStorage.getItem('token');


    const handleHeadingChange = (value: string) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    };

    const handleGeneratePoll = async () => {
        try {
            const response = await fetch('http://localhost:3001/polls', {
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
        console.log('Starting handleGenerateQR');
        setLoading(true);
        try {
            const uuid = await handleGeneratePoll();
            if (!uuid) {
                console.log('Poll generation failed, exiting handleGenerateQR');
                setLoading(false);
                return; // If poll generation failed, exit
            }

            const url = `http://localhost:3000/polls/${uuid}`;
            console.log('Poll URL:', url); // Debugging line

            const response = await fetch(`http://localhost:3001/qr?qrUrl=${encodeURIComponent(url)}`, {
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
            <PageHeader heading="Create Event Planning Poll" link="/select-template"/>
            <div className='template'>
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange} />
                <p className='question'>Which drinks are absolutely essential?</p>
                <InputField label={"drinks"} placeholder={"I would like to drink..."} onChange={function (value: string): void { }} />
                <p className='question'>Which food are absolutely essential?</p>
                <InputField label={"food"} placeholder={"I would like to eat..."} onChange={function (value: string): void { }} />
                <p className='question'>What kind of music should be played?</p>
                <MultipleChoiceSelector options={['Pop', 'Rock', 'Rap', 'EDM', 'Indie']} onChange={function (option: string): void { }} />
                <p className='question'>What activities should be at the event?</p>
                <MultipleChoiceSelector options={['Theme', 'Photobooth', 'Beer Pong Table', 'Karaoke']} onChange={function (option: string): void { }} />
                <p className='question'>What do you wish for the event?</p>
                <InputField label={"wish"} placeholder={"For this event I need..."} onChange={function (value: string): void { }} />
                <p className='heading'>
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                <div className="generateButton">
                    {!qrCodeUrl && <GenerateButton label={""} onClick={handleGenerateQR} />}
                    {loading && <CircularProgress />}
                    {qrCodeUrl && (
                        <div className="qr-code">
                            <img src={qrCodeUrl} alt="QR Code" />
                        </div>
                    )}
                    <QrToast />
                </div>
                {backButton &&
                    <div className={"BackButton"}>
                        <center>
                            <MainButton text={"Back to Dashboard"} link={"/dashboard"} />
                        </center>
                    </div>
                }
            </div>
        </>
     );
  };
  
  export default PlanningTemplate;