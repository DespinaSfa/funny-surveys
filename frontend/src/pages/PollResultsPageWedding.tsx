import c from './Page_styles.module.scss';
import PageHeader from "../Components/PageHeader/PageHeader";
import {useEffect, useState} from "react";
import { PollData, calculateAverageKnownCoupleSince, calculateWeddingCounts } from './PollResultsHelpers';
import MyBarChartComponent from "../Components/BarChart";
import HorizontalBarChart from "../Components/BarChart";


const PollResultsPageWedding = () => {

    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJleHAiOjE3MTU2OTIxNjQsImlhdCI6MTcxNTY5MDcyNCwidXNlcl9pZCI6MX0.hEeCgWL3eIZ6UQ4-FcPM22aXozstkuHVySoyDBtUdcY"

    const [pollData, setPollData] = useState<PollData | null>(null); // Specify PollData type for useState
    const [inviteCounts, setInviteCounts] = useState<{ [key: string]: number }>({});
    const [highlightCounts, setHighlightCounts] = useState<{ [key: string]: number }>({});
    const [averageKnownCoupleSince, setAvgKnown] = useState<number>(0);

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
                setInviteCounts(calculateWeddingCounts(data.PollWeddings, 'WeddingInvite'));
                setHighlightCounts(calculateWeddingCounts(data.PollWeddings, 'WeddingHighlight'));
                setAvgKnown(calculateAverageKnownCoupleSince(data.PollWeddings));

            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPollData();
    }, []);

    return (
        <div>
            {pollData && (
                <div>
                    <PageHeader heading={`Title: ${pollData.Title}`} link="/"/>
                    <p>Description: {pollData.Description}</p>
                    <div className={c.pollResCard}>
                        <h3>Who did invite you to the wedding?</h3>
                        <HorizontalBarChart counts={inviteCounts}/>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>How long have you known the bride and groom?</h3>
                        <p>Average: {averageKnownCoupleSince.toFixed(0)} years</p>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>How do you know the bride and groom?</h3>
                        {pollData.PollWeddings.map((wedding, index) => (
                            <div key={index}>{wedding.KnowCoupleFromWhere}</div>
                        ))}
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What was your highlight of the wedding??</h3>
                        <HorizontalBarChart counts={highlightCounts}/>
                    </div>
                    <div className={c.pollResCard}>
                        <h3>What do you wish the bride and groom?</h3>
                        {pollData.PollWeddings.map((wedding, index) => (
                            <div key={index}>{wedding.CoupleWish}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default PollResultsPageWedding;