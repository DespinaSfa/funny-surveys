import GenerateButton from "../Components/GenerateButton/GenerateButton";
import InputField from "../Components/InputField";
import MultipleChoiceSelector from "../Components/MultipleChoiceSelector";
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
                <PollHeader onChangeHeading={handleHeadingChange} onChangeDescription={handleDescriptionChange} />
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
                <p className='heading'>
                    4. Everything Correct? Then Generate Your Poll!
                </p>
                <div className='generateButton'>
                    <GenerateButton label={""} onClick={handleGeneratePoll} />
                </div>
            </div>
        </>
     );
  };
  
  export default WeddingTemplate;