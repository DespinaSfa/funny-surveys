import InputField from "../InputField";
import MultipleChoiceSelector from "../MultipleChoiceSelector";
import RangeSelector from "../RangeSelector";
import './Template.scss';


const Wedding = () => {

    return (
        <>
            <p className='question'>Who invited you to the wedding?</p>
            <MultipleChoiceSelector options={['Bride', 'Groom', 'Both']} onChange={function (option: string): void {} } />
            <p className='question'>How long have you known the bride and groom?</p>
            <RangeSelector min={0} max={30} step={1} onChange={function (value: number): void {} } />
            <p className='question'>How do you know the bride and groom?</p>
            <InputField label={"History"} placeholder={"I know you..."} onChange={function (value: string): void {} } />
            <p className='question'>What was your highlight of the wedding?</p>
            <MultipleChoiceSelector options={['Wedding Ceremony', 'Food', 'Wedding dance', 'Program', 'After Party']} onChange={function (option: string): void {} } />
            <p className='question'>What do you wish the bride and groom?</p>
            <InputField label={"Wishes"} placeholder={"I wish you..."} onChange={function (value: string): void {} } />
        </>
    );
  };
  
  export default Wedding;