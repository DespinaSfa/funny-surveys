import c from './Page_styles.module.scss';
import PageHeader from "../Components/PageHeader/PageHeader";
import {useEffect, useState} from "react";
import {PollData, calculateCounts} from './PollResultsHelpers';

const PollResultsPageParty = () => {

    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE3MTU1NDk1NjgsImlhdCI6MTcxNTU0ODEyOCwidXNlcl9pZCI6MX0.6ttZOUFetKNVuxEwMQIn4xnsWxZMrnqNdaQTPl0mWes"

    const [pollData, setPollData] = useState<PollData | null>(null); // Specify PollData type for useState
    const [alcoholLevelCounts, setAlcoholLevelCounts] = useState<{ [key: string]: number }>({});
    const [goalAlcoholLevelCounts, setGoalAlcoholLevelCounts] = useState<{ [key: string]: number }>({});
    const [favPartyActivity, setFavPartyActivityCounts] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        // Function to fetch poll data
        const fetchPollData = async () => {
            try {
                const response = await fetch("http://localhost:3001/polls/2", {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch poll data");
                }
                const data = await response.json();
                setPollData(data);
                if (pollData) {
                    const alcoholCounts = calculateCounts(pollData.PollParties, 'CurrentAlcoholLevel');
                    setAlcoholLevelCounts(alcoholCounts);
                    const goalAlcoholCounts = calculateCounts(pollData.PollParties, 'PreferredAlcoholLevel');
                    setGoalAlcoholLevelCounts(goalAlcoholCounts);
                    const favPartyActivityCount = calculateCounts(pollData.PollParties, 'FavoriteActivity');
                    setFavPartyActivityCounts(favPartyActivityCount);
                }
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPollData(); // Call the fetchPollData function when the component mounts
    }, []);

    return (
        <div>
            {pollData && (
                <div>
                    <PageHeader heading={`Title: ${pollData.Title}`} link="/" />
                    <p>Description: {pollData.Description}</p>
                    <div className={c.pollResCard}>
                        <h3>Which songs should definitely be played tonight? 📻</h3>
                        {pollData.PollParties.map((wedding, index) => (
                            <div key={index}>{wedding.SongToBePlayed}</div>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What is your current alcohol level? 📈</h3>
                        {Object.entries(alcoholLevelCounts).map(([level, count]) => (
                            <p key={level}>Level {level}: {count}</p>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What alcohol level have you set as your goal for today? 🍺</h3>
                        {Object.entries(goalAlcoholLevelCounts).map(([level, count]) => (
                            <p key={level}>Level {level}: {count}</p>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What is your favortite party activity?</h3>
                        {Object.entries(favPartyActivity).map(([activity, count]) => (
                            <p key={activity}>{activity}: {count}</p>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>Which snacks or drinks would you like for the next party? 🍔</h3>
                        {pollData.PollParties.map((party, index) => (
                            <div key={index}>{party.WishSnack}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default PollResultsPageParty;

