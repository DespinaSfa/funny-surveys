import HorizontalBarChart from "../Components/BarChart";
import c from './Page_styles.module.scss';
import { calculateAverageKnownCoupleSince, calculateWeddingCounts, PollData } from './PollResultsHelpers';

const PollResultsWedding = ({ data }: { data: PollData }) => {
    const inviteCounts = calculateWeddingCounts(data.PollWeddings, 'WeddingInvite');
    const highlightCounts = calculateWeddingCounts(data.PollWeddings, 'WeddingHighlight');
    const averageKnownCoupleSince = calculateAverageKnownCoupleSince(data.PollWeddings);

    return (
        <div>
            <div className={c.pollResCard}>
                <h3>Who did invite you to the wedding?</h3>
                <HorizontalBarChart counts={inviteCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>How long have you known the bride and groom?</h3>
                <p>Average: {averageKnownCoupleSince.toFixed(0)} years</p>
            </div>
            <div className={c.pollResCard}>
                <h3>How do you know the bride and groom?</h3>
                {data.PollWeddings.map((wedding, index) => (
                    <div key={index}>{wedding.KnowCoupleFromWhere}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3>What was your highlight of the wedding??</h3>
                <HorizontalBarChart counts={highlightCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What do you wish the bride and groom?</h3>
                {data.PollWeddings.map((wedding, index) => (
                    <div key={index}>{wedding.CoupleWish}</div>
                ))}
            </div>
        </div>
    );
};

export default PollResultsWedding;
