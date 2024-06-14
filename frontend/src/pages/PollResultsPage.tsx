import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from "../Components/PageHeader/PageHeader";
import PollResultsWedding from './PollResultsWedding';
import PollResultsParty from './PollResultsParty';
import PollResultsPlanning from './PollResultsPlanning';
import { PollData } from './PollResultsHelpers';

const ResultsPage = () => {
    const [pollData, setPollData] = useState<PollData | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPollData = async () => {
            try {
                const response = await fetch(`http://localhost:3001/polls/${id}`);
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
        <div>
            <PageHeader heading={`Title: ${pollData.Title}`} link="/dashboard" />
            <p>Description: {pollData.Description}</p>
            {pollData.PollType === 'wedding' && <PollResultsWedding data={pollData} />}
            {pollData.PollType === 'party' && <PollResultsParty data={pollData} />}
            {pollData.PollType === 'planning' && <PollResultsPlanning data={pollData} />}
            {/* Add more conditions here for other poll types */}
        </div>
    );
};

export default ResultsPage;
