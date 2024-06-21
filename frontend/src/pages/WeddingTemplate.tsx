import GenerateButton from "../Components/GenerateButton/GenerateButton";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import RangeSelector from "../Components/RangeSelector";
import './template.scss';
import {useEffect, useState} from "react";

const WeddingTemplate = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const pollType = "wedding";
    const token = localStorage.getItem('token');
    const optionsInvited = ['Bride', 'Groom', 'Both'];
    const highlightOptions = ['Wedding Ceremony', 'Food', 'Wedding dance', 'Program', 'After Party'];


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
            <PageHeader heading="Create Wedding Poll" link="/select-template"/>
            <div className='template'>
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange}/>
                <p className='question'>Who invited you to the wedding?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {optionsInvited.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className='question'>How long have you known the bride and groom?</p>
                <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
                <RangeSelector min={0} max={5} step={1} disabled={true} onChange={function (value: number): void {
                }}/><br/>
                <p className='question'>How do you know the bride and groom?</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <p className='question'>What was your highlight of the wedding?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {highlightOptions.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className='question'>What do you wish the bride and groom?</p>
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

export default WeddingTemplate;