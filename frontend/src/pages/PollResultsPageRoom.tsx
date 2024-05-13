import c from './Page_styles.module.scss';
import PageHeader from "../Components/PageHeader/PageHeader";
import RangeSelector from "../Components/RangeSelector";
import {useEffect, useState} from "react";

// TODO auf room anpassen

const PollResultsPageParty = () => {

    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE3MTU2MDI5ODcsImlhdCI6MTcxNTYwMTU0NywidXNlcl9pZCI6MX0.qGI8tE4934s4j15OAIfUCLmy7v9iKVcbC3zexxRZYe8"

    interface PollData {
        ID: number;
        CreatedAt: string;
        UpdatedAt: string;
        DeletedAt: string | null;
        UserID: number;
        Title: string;
        Description: string;
        PollType: string;
        PollParties: PollParty[];
        PollWeddings: PollWedding[];
    }

    interface PollParty {
        ID: number;
        CreatedAt: string;
        UpdatedAt: string;
        DeletedAt: string | null;
        PollID: number;
        SongToBePlayed: string;
        CurrentAlcoholLevel: number;
        PreferredAlcoholLevel: number;
        FavoriteActivity: string;
        WishSnack: string;
    }

    // Define the interface for PollWedding
    interface PollWedding {
        ID: number;
        CreatedAt: string;
        UpdatedAt: string;
        DeletedAt: string | null;
        PollID: number;
        WeddingInvite: string;
        KnowCoupleSince: number;
        KnowCoupleFromWhere: string;
        WeddingHighlight: string;
        CoupleWish: string;
    }

    // TODO once auth works use actual data
    const [pollData, setPollData] = useState<PollData | null>(null); // Specify PollData type for useState

    useEffect(() => {
        // Function to fetch poll data
        const fetchPollData = async () => {
            try {
                const response = await fetch("http://localhost:3001/polls/1", {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch poll data");
                }
                const data = await response.json();
                setPollData(data);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPollData(); // Call the fetchPollData function when the component mounts
    }, []);

    // todo use endpoints instead
    const wishes = ["Wish 1", "Wish 2", "Wish 3"];
    const history = ["History 1", "History 2", "History 3"];

    return (
        <div>
            {pollData && (
                <div>
                    <PageHeader heading={`Title: ${pollData.Title}`} link="/" />
                    <p>Description: {pollData.Description}</p>
                    <div className={c.pollResCard}>
                        <h3>Who invited you?</h3>
                        <p>blablabla</p>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>How long have you known the groom/bride for (years)?</h3>
                        <RangeSelector min={0} max={40} step={1} onChange={function (value: number): void {
                        }}/><br/>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>How do you know the bride and groom?</h3>
                        {history.map((history, index) => (
                            <div key={index}>{history}</div>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What was your highlight of the wedding??</h3>
                        <p>blablabla</p>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What do you wish the bride and groom?</h3>
                        {wishes.map((wish, index) => (
                            <div key={index}>{wish}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default PollResultsPageParty;

