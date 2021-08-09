import { ChartType } from '../../../core/interfaces/chart.interface';

const donutChart: ChartType = {
    labels: [
        'Desktops', 'Tablets'
    ],
    datasets: [
        {
            label: '# of Votes',
            data: [300, 210],
            backgroundColor: [
                '#556ee6', '#ebeff2'
            ],
            hoverBackgroundColor: ['#556ee6', '#ebeff2'],
            hoverBorderColor: '#fff',
            borderWidth: 6
        },

        
    ],
    options: {
        maintainAspectRatio: false,
        legend: {
            position: 'bottom',
        }
    }
};


export {  donutChart };
