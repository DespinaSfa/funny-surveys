import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import './template.scss';
import { useEffect, useState } from "react";

const PlanningTemplate = () => {

    useEffect(() => {

    }, []);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const pollType = "planning";
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
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ description, pollType, title })
        });
        } catch (error) {
        console.error('Error occurred during generate poll:', error);
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
                <div className='generateButton'>
                    <GenerateButton label={""} onClick={handleGeneratePoll} />
                </div>
            </div>
        </>
     );
  };
  
  export default PlanningTemplate;