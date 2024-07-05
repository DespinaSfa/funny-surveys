import HorizontalBarChart from "../BarChart";
import c from '../../pages/page_styles.module.scss';
import '../../pages/results.scss';
import { calculateAverageKnownCoupleSince, calculateWeddingCounts, PollData } from '../../pages/models/PollHelpers';

interface ResultsWeddingProps {
    data: PollData;
}

//displays results for planning polls
const ResultsWedding: React.FC<ResultsWeddingProps> = ({ data }) => {

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
                    <div className="text-result" key={index}>{`● ${wedding.KnowCoupleFromWhere}`}</div>
                ))}
            </div>
            <div className={c.pollResCard}>
                <h3>What was your highlight of the wedding??</h3>
                <HorizontalBarChart counts={highlightCounts} />
            </div>
            <div className={c.pollResCard}>
                <h3>What do you wish the bride and groom?</h3>
                {data.PollWeddings.map((wedding, index) => (
                    <div className="text-result" key={index}>{`● ${wedding.CoupleWish}`}</div>
                ))}
            </div>
        </div>
    );
};

export default ResultsWedding;
