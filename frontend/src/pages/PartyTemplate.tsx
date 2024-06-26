import GenerateButton from "../Components/GenerateButton/GenerateButton";
import PageHeader from "../Components/PageHeader/PageHeader";
import PollHeader from "../Components/PollHeader/PollHeader";
import RangeSelector from "../Components/RangeSelector";
import './template.scss';
import {useEffect, useState} from "react";

const PartyTemplate = () => {


    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const pollType = "party";
    const token = localStorage.getItem('token');
    const options = ['Dancing 💃', 'Shout along to party hits or karaoke 🎤', 'PartyGames (Bierpong, Rage-Cage, etc.) 🍻 ', 'Chilling and chatting a bit outside with friends 🗨️'];

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
            <PageHeader heading="Create Party Poll" link="/select-template" />
            <div className="template">
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange}/>
                <p className="question">Which songs should definitely be played tonight? 📻</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <p className="question">What is your current alcohol level? 📈</p>
                <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
                <RangeSelector min={0} max={5} step={1} disabled={true} onChange={function (value: number): void {
                }}/> <br/>
                <p className="question">What alcohol level have you set as your goal for today? 🍺</p>
                <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
                <RangeSelector min={0} max={5} step={1} disabled={true} onChange={function (value: number): void {
                }}/><br/>
                <p className="question">What is your favortite party activity?</p>
                <p className="explanation">Your guests will be able to select from these options:</p>
                <ul className="explanation">
                    {options.map((option, index) => (
                        <li key={index}>{option}</li>
                    ))}
                </ul>
                <p className="question">Which snacks or drinks would you like for the next party? 🍔</p>
                <p className="explanation">Your guests will be able to enter any text answer!</p>
                <hr/>
                <p className="heading">
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                <div className="generateButton">
                    <GenerateButton label={""} onClick={handleGeneratePoll}/>
                </div>
            </div>
        </>
    );
};

export default PartyTemplate;