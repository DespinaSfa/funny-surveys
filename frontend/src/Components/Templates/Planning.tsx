import { useParams } from "react-router-dom";
import InputField from "../InputField";
import MainButton from "../MainButton/MainButton";
import MultipleChoiceSelector from "../MultipleChoiceSelector";
import './Template.scss';
import { useState } from "react";

interface Data {
    EssentialDrink: string;
    EssentialFood: string;
    MusicToBePlayed: string;
    Activities: string;
    EventWish: string;
}
interface PlanningProps {
    poll_id: string;
}

const Planning: React.FC<PlanningProps> = (poll_id) => {

    const poll_type = 'planning';
    const { id } = useParams<{ id: string }>();
    const [essentialDrink, setEssentialDrink] = useState('');
    const [essentialFood, setEssentialFood] = useState('');
    const [musicToBePlayed, setMusicToBePlayed] = useState('');
    const [activities, setActivities] = useState('');
    const [eventWish, setEventWish] = useState('');

    const handleEssentialDrinkChange = (value: string) => {
        setEssentialDrink(value);
    };
    const handleEssentialFoodChange = (value: string) => {
        setEssentialFood(value);
    };
    const handleMusicToBePlayed = (value: string) => {
        setMusicToBePlayed(value);
    };
    const handleActivities = (value: string) => {
        setActivities(value);
    };
    const handleEventWish = (value: string) => {
        setEventWish(value);
    };

    const handleSendAnswers = async () => {

        let data: Data;
        data = {EssentialDrink: essentialDrink, EssentialFood: essentialFood, MusicToBePlayed: musicToBePlayed, Activities: activities, EventWish: eventWish};

        try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${id}`, {
            method: 'POST',
            body: JSON.stringify({ id, poll_type, data })
        });
        } catch (error) {
        console.error('Error occurred during generate poll:', error);
        }
    };

    return (
        <>
            <p className='question'>Which drinks are absolutely essential?</p>
            <InputField label={"drinks"} placeholder={"I would like to drink..."} onChange={handleEssentialDrinkChange} />
            <p className='question'>Which food are absolutely essential?</p>
            <InputField label={"food"} placeholder={"I would like to eat..."} onChange={handleEssentialFoodChange} />
            <p className='question'>What kind of music should be played?</p>
            <MultipleChoiceSelector options={['pop', 'rock', 'rap', 'edm', 'indie']} onChange={handleMusicToBePlayed} />
            <p className='question'>What activities should be at the event?</p>
            <MultipleChoiceSelector options={['theme', 'photobooth', 'beerpong', 'karaoke']} onChange={handleActivities} />
            <p className='question'>What do you wish for the event?</p>
            <InputField label={"wish"} placeholder={"For this event I need..."} onChange={handleEventWish} />
            <div className="button">
                <MainButton text={"Send!"} link={`/results/${id}`} onClick={handleSendAnswers} />
            </div>
        </>
    );
  };
  
  export default Planning;