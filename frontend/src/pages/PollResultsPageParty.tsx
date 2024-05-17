import c from './Page_styles.module.scss';
import PageHeader from "../Components/PageHeader/PageHeader";
import {useEffect, useState} from "react";
import {PollData, calculateCounts} from './PollResultsHelpers';
import MyBarChartComponent from "../Components/BarChart";
import HorizontalBarChart from "../Components/BarChart";

const PollResultsPageParty = () => {

    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE3MTU4NjM1NzIsImlhdCI6MTcxNTg2MjEzMiwidXNlcl9pZCI6MX0.no4EXBRFuxNbZRqAP_cuNhi7kiy7p-AsGX4OtPkSr4o"

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
                setPollData(currentData => {
                    if (currentData) {
                        const alcoholCounts = calculateCounts(currentData.PollParties, 'CurrentAlcoholLevel');
                        setAlcoholLevelCounts(alcoholCounts);
                        const goalAlcoholCounts = calculateCounts(currentData.PollParties, 'PreferredAlcoholLevel');
                        setGoalAlcoholLevelCounts(goalAlcoholCounts);
                        const favPartyActivityCount = calculateCounts(currentData.PollParties, 'FavoriteActivity');
                        setFavPartyActivityCounts(favPartyActivityCount);
                    }
                    return data;
                });
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
                    <PageHeader heading={`Title: ${pollData.Title}`} link="/"/>
                    <p>Description: {pollData.Description}</p>
                    <div className={c.pollResCard}>
                        <h3>Which songs should definitely be played tonight? 📻</h3>
                        {pollData.PollParties.map((item, index) => (
                            <div key={index}>{item.SongToBePlayed}</div>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What is your current alcohol level? 📈</h3>
                        <HorizontalBarChart counts={alcoholLevelCounts}/>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What alcohol level have you set as your goal for today? 🍺</h3>
                        <HorizontalBarChart counts={goalAlcoholLevelCounts}/>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What is your favorite party activity?</h3>
                        <HorizontalBarChart counts={favPartyActivity}/>
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