import React from 'react';
import HorizontalBarChart from "../Components/BarChart";
import c from './Page_styles.module.scss'; // Assuming you are using SCSS for styles
import { calculateCountsPlanning, PollData } from './PollHelpers';

const PollResultsPlanning = ({ data }: { data: PollData }) => {
    const musicPreferencesCounts = calculateCountsPlanning(data.PollPlannings, 'MusicToBePlayed');
    const eventActivitiesCounts = calculateCountsPlanning(data.PollPlannings, 'Activities');
    const eventWishesCounts = calculateCountsPlanning(data.PollPlannings, 'EventWish');

    return (
        <div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>Which drinks are absolutely essential?</span> 🥤
                </h3>
                {data.PollPlannings.map((item, index) => (
                    <div key={index}>{item.EssentialDrink}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>Which food are absolutely essential?</span> 🍔
                </h3>
                {data.PollPlannings.map((item, index) => (
                    <div key={index}>{item.EssentialFood}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What kind of music should be played?</span> 🎶
                </h3>
                <HorizontalBarChart counts={musicPreferencesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What activities should be at the event?</span> 🎉
                </h3>
                <HorizontalBarChart counts={eventActivitiesCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3 className={c.heading}>
                    <span>What do you wish for the event?</span> 🌟
                </h3>
                <HorizontalBarChart counts={eventWishesCounts} />
            </div>
        </div>
    );
};

export default PollResultsPlanning;
