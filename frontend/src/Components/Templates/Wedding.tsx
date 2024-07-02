import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../InputField";
import MultipleChoiceSelector from "../MultipleChoiceSelector";
import RangeSelector from "../RangeSelector";
import './Template.scss';
import MainButton from "../MainButton/MainButton";

interface Data {
    WeddingInvite: string;
    KnowCoupleSince: number;
    KnowCoupleFromWhere: string;
    WeddingHighlight: string;
    CoupleWish: string;
}

interface WeddingProps {
    poll_id: string;
}

const Wedding: React.FC<WeddingProps> = ({ poll_id }) => {
    const poll_type = 'wedding';
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [weddingInvite, setWeddingInvite] = useState('');
    const [knowCoupleSince, setKnowCoupleSince] = useState(0);
    const [knowCoupleFromWhere, setKnowCoupleFromWhere] = useState('');
    const [weddingHighlight, setWeddingHighlight] = useState('');
    const [coupleWish, setCoupleWish] = useState('');
    
    const [fromWhereError, setFromWhereError] = useState(false);
    const [wishError, setWishError] = useState(false);

    const handleWeddingInviteChange = (value: string) => {
        setWeddingInvite(value);
    };

    const handleKnowCoupleSinceChange = (value: number) => {
        setKnowCoupleSince(value);
    };

    const handleKnowCoupleFromWhereChange = (value: string) => {
        setKnowCoupleFromWhere(value);
        setFromWhereError(value === '');
    };

    const handleWeddingHighlightChange = (value: string) => {
        setWeddingHighlight(value);
    };

    const handleCoupleWishChange = (value: string) => {
        setCoupleWish(value);
        setWishError(value === '');
    };

    const handleSendAnswers = async () => {
        if (!weddingInvite || !knowCoupleFromWhere || !coupleWish) {
            setFromWhereError(!knowCoupleFromWhere);
            setWishError(!coupleWish);
            return;
        }

        const data: Data = {
            WeddingInvite: weddingInvite,
            KnowCoupleSince: knowCoupleSince,
            KnowCoupleFromWhere: knowCoupleFromWhere,
            WeddingHighlight: weddingHighlight,
            CoupleWish: coupleWish
        };

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
            <p className='question'>Who invited you to the wedding?</p>
            <MultipleChoiceSelector
                options={['bride', 'groom', 'both']}
                onChange={handleWeddingInviteChange}
            />

            <p className='question'>How long have you known the bride and groom?</p>
            <RangeSelector
                min={0}
                max={30}
                step={1}
                onChange={handleKnowCoupleSinceChange}
            />

            <p className='question'>How do you know the bride and groom?</p>
            <InputField
                label={"History"}
                placeholder={"I know you..."}
                onChange={handleKnowCoupleFromWhereChange}
                error={fromWhereError}
                sx={{ marginBottom: '20px' }}
            />
            {fromWhereError && <p className="error">Please enter how you know them</p>}

            <p className='question'>What was your highlight of the wedding?</p>
            <MultipleChoiceSelector
                options={['wedding', 'food', 'dance', 'program', 'afterParty']}
                onChange={handleWeddingHighlightChange}
            />

            <p className='question'>What do you wish the bride and groom?</p>
            <InputField
                label={"Wishes"}
                placeholder={"I wish you..."}
                onChange={handleCoupleWishChange}
                error={wishError}
                sx={{ marginBottom: '20px' }}
            />
            {wishError && <p className="error">Please enter your wishes for the couple</p>}

            <div className="button">
                <MainButton text={"Send!"} onClick={handleSendAnswers} />
            </div>
        </>
    );
};

export default Wedding;
