import './Template.scss';

//template for planning poll
const PlanningTemplate = () => {

    const optionsActivities = ['Theme', 'Photobooth', 'Beer Pong Table', 'Karaoke'];
    const optionsMusic = ['Pop', 'Rock', 'Rap', 'EDM', 'Indie'];

    return (
        <>
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
        </>
    );
};

export default PlanningTemplate;
