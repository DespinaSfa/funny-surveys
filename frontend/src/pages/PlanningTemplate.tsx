import GenerateButton from "../Components/GenerateButton/GenerateButton";
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
    const optionsActivities = ['Theme', 'Photobooth', 'Beer Pong Table', 'Karaoke'];
    const optionsMusic = ['Pop', 'Rock', 'Rap', 'EDM', 'Indie'];


    const handleHeadingChange = (value: string) => {
        setTitle(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    };

    const handleGeneratePoll = async () => {
        try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls`, {
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
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange}/>
                <p className='question'>Which drinks are absolutely essential?</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <p className='question'>Which food are absolutely essential?</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <p className='question'>What kind of music should be played?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {optionsMusic.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className='question'>What activities should be at the event?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {optionsActivities.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className='question'>What do you wish for the event?</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <hr/>
                <p className='heading'>
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                <div className='generateButton'>
                    <GenerateButton label={""} onClick={handleGeneratePoll}/>
                </div>
            </div>
        </>
    );
};

export default PlanningTemplate;