import RangeSelector from "../RangeSelector";
import './template.scss';

const PartyTemplate = () => {
    const options = ['Dancing 💃', 'Shout along to party hits or karaoke 🎤', 'PartyGames (Bierpong, Rage-Cage, etc.) 🍻 ', 'Chilling and chatting a bit outside with friends 🗨️'];

    return (
        <>
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
        </>
    );
};

export default PartyTemplate;
