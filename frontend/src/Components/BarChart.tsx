import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    ChartOptions
} from 'chart.js';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip
);

// Define the type for the counts prop
interface HorizontalBarChartProps {
    counts: { [key: string]: number };
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ counts }) => {
    // Generate labels and data from the counts prop
    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Highlights',
                data: dataValues,
                backgroundColor: '#DBF881'
            }
        ]
    };

    const options: ChartOptions<'bar'> = {
        indexAxis: 'y',
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Ensure ticks increment by 1 bc it's a count
                    callback: function(value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                        return null;
                    },
                    color: '#fff'
                },
                title: {
                    display: true,
                    text: 'Count',
                    color: '#fff'
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#fff'
                },
                title: {
                    color: '#fff'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div>
            <Bar data={data} options={options}></Bar>
        </div>
    );
}

export default HorizontalBarChart;
