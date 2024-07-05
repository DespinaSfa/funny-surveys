import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from "../Components/PageHeader/PageHeader";
import PollResultsWedding from '../Components/Results/ResultsWedding';
import PollResultsParty from '../Components/Results/ResultsParty';
import PollResultsPlanning from '../Components/Results/ResultsPlanning';
import { PollData } from './models/PollHelpers';
import './results.scss'

const Results = () => {
    const [pollData, setPollData] = useState<PollData | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls/${id}`);
                if (!response.ok) {
                    console.error("Failed to fetch poll data");
                    return;
                }
                const data = await response.json();
                setPollData(data);
            } catch (error) {
                console.error("Error fetching poll data:", error);
            }
        };
        fetchPollData();
    }, [id]);

    if (!pollData) return <div>Loading...</div>;

    return (
        <div className="poll-results">
            <PageHeader heading={pollData.Title} />
            <p className="description">{pollData.Description}</p>
            {pollData.PollType === 'wedding' && <PollResultsWedding data={pollData} />}
            {pollData.PollType === 'party' && <PollResultsParty data={pollData} />}
            {pollData.PollType === 'planning' && <PollResultsPlanning data={pollData} />}
        </div>
    );
};

export default Results;
