import RangeSelector from "../RangeSelector";
import './template.scss';

const WeddingTemplate = () => {
    const optionsInvited = ['Bride', 'Groom', 'Both'];
    const highlightOptions = ['Wedding Ceremony', 'Food', 'Wedding dance', 'Program', 'After Party'];

    return (
        <>
            <p className='question'>Who invited you to the wedding?</p>
            <p className="explanation">Your guests will be able to select from these options:</p>
            <ul className="explanation">
                {optionsInvited.map((option, index) => (
                    <li key={index}>{option}</li>
                ))}
            </ul>
            <p className='question'>How long have you known the bride and groom?</p>
            <p className="explanation">Your guests will be able to select a value between 0 and 5!</p>
            <RangeSelector min={0} max={5} step={1} disabled={true} onChange={(value: number) => {}}/><br/>
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
        </>
    );
};

export default WeddingTemplate;
