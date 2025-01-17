import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from 'chart.js'; // Import the correct type for options

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
    hours: string[];
    checkedInUsers: number;
    allCounts: number[];
}

const BarChart: React.FC<BarChartProps> = (props) => {

    const data = {
        labels: props.hours,
        datasets: [{
            label: "Check-Ins",
            data: props.allCounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: "rgba(75, 192, 192)",
            borderWidth: 1,
            // barThickness: ,
            maxBarThickness: 60,
            minBarLength: 0,
        }],
    };

    // const options = {
    //     responsive: true,
    //     maintainAspectRatio: false,
    // };


    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'category', // X-axis is categorical with bin labels
                title: {
                    display: true,
                    text: 'Time (Hours)', // Can be adjusted based on your data
                },
            },
            y: {
                type: 'linear', // Y-axis is continuous, representing the frequency of items
                title: {
                    display: true,
                    text: 'Number of Check-Ins',
                },
                beginAtZero: true,
            },
        },
    };



    return (
        <div className='w-full h-80'>
            <Bar data={data} options={options}></Bar>
        </div>
    )
}

export default BarChart;