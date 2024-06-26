import { CircularProgress } from "@mui/material";
import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import QrToast from "../Components/QrToast/QrToast";
import RangeSelector from "../Components/RangeSelector";
import './template.scss';
import {useEffect, useState} from "react";

const PartyTemplate = () => {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
            const responseData = await response.json();
            const uuid = responseData.pollID || 'No UUID found';
            console.log(uuid);
            return uuid;
        } catch (error) {
            console.error('Error occurred during generate poll:', error);
        }
    };
    
    const handleGenerateQR = async () => {
        console.log('Starting handleGenerateQR');
        try {
            const uuid = await handleGeneratePoll();
            if (!uuid) {
                console.log('Poll generation failed, exiting handleGenerateQR');
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
    
            const responseText = await response.text();
            let responseData;
    
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Received invalid JSON from server');
            }
    
            // Handle the response data as needed
            console.log('QR Code Data:', responseData);
    
        } catch (error) {
            console.error('Error in handleGenerateQR:', error);
        }
    };

    //1. Response von POST abwarten -> Poll ID speichern
    // 2. Poll ID an QR endpoint weitergeben
    // 3. QR Code anzeigen
    // Loading Spinner anzeigen während 1. und 2.

    return (
        <>
            <PageHeader heading="Create Party Poll" link="/select-template" />
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
                    <GenerateButton label={""} onClick={handleGenerateQR} />
                    <CircularProgress />
                    <QrToast />
                </div>
            </div>
        </>
    );
  };
  
  export default PartyTemplate;