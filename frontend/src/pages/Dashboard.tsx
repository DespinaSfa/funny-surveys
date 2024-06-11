import "./dashboard.scss"
import ListItem from '../Components/ListItem/ListItem';
import { useEffect, useState } from "react";
import Poll from "./models/Poll";
import StatisticCard from "../Components/StatisticCard/StatisticCard";
import MainButton from "../Components/MainButton/MainButton";

const Dashboard = () => {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
        }

        const checkToken = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/check-token-valid`, {headers: { 'Authorization': `Bearer ${token}` } });
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                        return;
                    }
                }
            } catch (error) {
                console.error('Error checking token:', error);
            }
        };

        checkToken();

        const fetchPolls = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/polls`);
                if (!response.ok) {
                    throw new Error('Failed to fetch polls');
                }
                const data = await response.json();
                setPolls(data);
            } catch (error) {
                console.error('Error fetching polls:', error);
            }
        };

        fetchPolls();
    }, []);

    return (
        <>
            <h2 className="dashboard-title">About Your Polls</h2>
            <div className="poll-stats">
                <StatisticCard title={"Total Polls"} value={"123"}/>
                <StatisticCard title={"Total Participants"} value={"1234"}/>
                <StatisticCard title={"Most Popular Polls"} value={"Freds Fette Fete"}/>
                <StatisticCard title={"Least Popular Polls"} value={"Unsere Hochzeit"}/>
            </div>
            <div className="spread">
                <h2 className="dashboard-title">Your Polls</h2>
                <MainButton text={"Add Poll"} link={"/select-template"}/>
            </div>
            <div className="poll-list">
                {polls.length === 0 ? (
                    <p className="empty-message">No polls available</p>
                ) : (
                    polls.map((poll, index) => (
                        <ListItem key={index} title={poll.title} description={poll.description} />
                    ))
                )}
            </div>
        </>
    )
}

export default Dashboard;