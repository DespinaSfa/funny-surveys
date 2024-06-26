import { useState } from "react";
import InputField from "../InputField";
import MultipleChoiceSelector from "../MultipleChoiceSelector";
import RangeSelector from "../RangeSelector";
import './Template.scss';
import MainButton from "../MainButton/MainButton";
import { useNavigate, useParams } from "react-router-dom";

interface Data {
    SongToBePlayed: string;
    CurrentAlcoholLevel: number;
    PreferredAlcoholLevel: number;
    FavoriteActivity: string;
    WishSnack: string;
}
interface PartyProps {
    poll_id: string;
}

const Party: React.FC<PartyProps> = (poll_id) => {

    const poll_type = 'party';
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [songToBePlayed, setSongToBePlayed] = useState('');
    const [currentAlcoholLevel, setCurrentAlcoholLevel] = useState(0);
    const [preferredAlcoholLevel, setPreferredAlcoholLevel] = useState(0);
    const [favoriteActivity, setFavoriteActivity] = useState('dancing');
    const [wishSnack, setWishSnack] = useState('Wasser');

    const handleSongToBePlayedChange = (value: string) => {
        setSongToBePlayed(value);
    };
    const handleCurrentAlcoholLevelChange = (value: number) => {
        setCurrentAlcoholLevel(value);
    };
    const handlePreferredAlcoholLevel = (value: number) => {
        setPreferredAlcoholLevel(value);
    };
    const handleFavoriteActivity = (value: string) => {
        if (value == 'Dancing 💃' ) {
            setFavoriteActivity('dancing');
        } else if (value == 'Shout along to party hits or karaoke 🎤') {
            setFavoriteActivity('singing');
        }  else if (value == 'PartyGames (Bierpong, Rage-Cage, etc.) 🍻') {
            setFavoriteActivity('beerpong');
        }  else {
            setFavoriteActivity('drinking');
        }
    };
    const handleWishSnack = (value: string) => {
        setWishSnack(value);
    };

    const handleSendAnswers = async () => {
        let data: Data;
        data = {SongToBePlayed: songToBePlayed, CurrentAlcoholLevel: currentAlcoholLevel, PreferredAlcoholLevel: preferredAlcoholLevel, FavoriteActivity: favoriteActivity, WishSnack: wishSnack};

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${id}`, {
                method: 'POST',
                body: JSON.stringify({ id, poll_type, data }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                navigate(`/results/${id}`);
            } else {
                console.error('Failed to generate poll:', response.statusText);
            }
        } catch (error) {
            console.error('Error occurred during generate poll:', error);
        }
    };

    return (
        <>
            <p className="question">Which songs should definitely be played tonight? 📻</p>
            <InputField label={"Songs"} placeholder={"I would like to listen to..."} onChange={handleSongToBePlayedChange} />
            <p className="question">What is your current alcohol level? 📈</p>
            <RangeSelector min={0} max={5} step={1} onChange={handleCurrentAlcoholLevelChange} /> <br />
            <p className="question">What alcohol level have you set as your goal for today? 🍺</p>
            <RangeSelector min={0} max={5} step={1} onChange={handlePreferredAlcoholLevel} /><br />
            <p className="question">What is your favortite party activity?</p>
            <MultipleChoiceSelector options={['Dancing 💃', 'Shout along to party hits or karaoke 🎤', 
            'PartyGames (Bierpong, Rage-Cage, etc.) 🍻', 'Chilling and chatting a bit outside with friends 🗨️']} onChange={handleFavoriteActivity} />
            <p className="question">Which snacks or drinks would you like for the next party? 🍔</p>
            <InputField label={"Snack/Drink"} placeholder={"I would like to eat/drink..."} onChange={handleWishSnack} />
            <div className="button">
                <MainButton text={"Send!"} onClick={handleSendAnswers} />
            </div>
        </>
    );
  };
  
  export default Party;