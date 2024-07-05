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

interface HorizontalBarChartProps {
    counts: { [key: string]: number };
}

//bar charts for result page
const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ counts }) => {

    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Highlights',
                data: dataValues,
                backgroundColor: '#DBF881',
                barThickness: 20
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
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#fff'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    const barCount = labels.length;
    const minHeight = 150;
    const chartHeight = Math.max(barCount * 50, minHeight);

    return (
        <div style={{ height: `${chartHeight}px` }}>
            <Bar data={data} options={options}></Bar>
        </div>
    );
}

export default HorizontalBarChart;
