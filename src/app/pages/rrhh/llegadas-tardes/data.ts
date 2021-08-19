import { ChartType } from '../../../core/interfaces/chart.interface';

const donutChart: ChartType = {
    labels: [
        'Desktops', 'Tablets'
    ],
    datasets: [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
        { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
        
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
        }
    }
};


export {  donutChart };
