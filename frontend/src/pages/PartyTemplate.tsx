import { CircularProgress } from "@mui/material";
import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import QrToast from "../Components/QrToast/QrToast";
import RangeSelector from "../Components/RangeSelector";
import './template.scss';
import { useState } from "react";
import MainButton from "../Components/MainButton/MainButton";

const PartyTemplate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [button , setBackButton] = useState<boolean>(false);
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
            <PageHeader heading="Create Party Poll" />
            <div className="template">
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange} />
                <p className="question">Which songs should definitely be played tonight? 📻</p>
                <InputField label={"Songs"} placeholder={"I would like to listen to..."} onChange={function (value: string): void { }} />
                <p className="question">What is your current alcohol level? 📈</p>
                <RangeSelector min={0} max={5} step={1} onChange={function (value: number): void { }} /> <br />
                <p className="question">What alcohol level have you set as your goal for today? 🍺</p>
                <RangeSelector min={0} max={5} step={1} onChange={function (value: number): void { }} /><br />
                <p className="question">What is your favortite party activity?</p>
                <MultipleChoiceSelector options={['Dancing 💃', 'Shout along to party hits or karaoke 🎤',
                    'PartyGames (Bierpong, Rage-Cage, etc.) 🍻 ', 'Chilling and chatting a bit outside with friends 🗨️']} onChange={function (option: string): void { }} />
                <p className="question">Which snacks or drinks would you like for the next party? 🍔</p>
                <InputField label={"Snack/Drink"} placeholder={"I would like to eat/drink..."} onChange={function (value: string): void { }} />
                <p className="heading">
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
