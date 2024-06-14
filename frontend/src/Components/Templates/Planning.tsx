import InputField from "../InputField";
import MultipleChoiceSelector from "../MultipleChoiceSelector";
import './Template.scss';


const Planning = () => {

    return (
        <>
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
        </>
    );
  };
  
  export default Planning;