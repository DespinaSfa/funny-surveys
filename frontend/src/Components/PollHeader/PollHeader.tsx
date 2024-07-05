import React from 'react';
import InputField from '../InputField';
import EditIcon from '@mui/icons-material/Edit';
import './pollHeader.scss';

interface PollHeaderProps {
   onChangeHeading?: (value: string) => void;
   onChangeDescription?: (value: string) => void;
 }

const PollHeader: React.FC<PollHeaderProps> = ({ onChangeHeading, onChangeDescription }) => {

   const handleHeadingChange = (value: string) => {
      if (onChangeHeading) {
         onChangeHeading(value);
      }
    };

    const handleDescriptionChange = (value: string) => {
      if (onChangeDescription) {
         onChangeDescription(value);
      }
    };

    return (
        <div>
            <p className='heading'>
                1. Select A Fancy Name For Your Poll
            </p>
            <InputField startIcon={<EditIcon className='editSVG'/>} label={'Heading'} placeholder={'Name of your poll'} onChange={handleHeadingChange}/>
            <p className='heading'>
                2. Write A Nice Description
            </p>
            <InputField startIcon={<EditIcon className='editSVG'/>} label={'Description'} placeholder={'This poll is about...'} onChange={handleDescriptionChange}/>
            <hr/>
            <p className='heading'>
                3. Check The Poll
            </p>
        </div>
    );
  };
  
  export default PollHeader;