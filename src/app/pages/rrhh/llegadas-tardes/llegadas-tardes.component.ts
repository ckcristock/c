import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { donutChart } from './data';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { LateArrivalsService } from './late-arrivals.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
@Component({
  selector: 'app-llegadas-tardes',
  templateUrl: './llegadas-tardes.component.html',
  styleUrls: ['./llegadas-tardes.component.scss'],
})
export class LlegadasTardesComponent implements OnInit {
  donutChart = donutChart;
  group_id: any;
  people_id = '';
  dependency_id: any;
  loading = false;
  donwloading = false;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Llegadas tardes' },
  ];
  public lineChartLabels: Label[] = [];
  options: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            precision: 0,
            stepSize: 1,
          },
        },
      ],
    },
    legend: { display: true, labels: { fontColor: 'black' } },
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  company_id: any;
  cargando = true;
  companies: any = [];
  companyList: any = [];

  groupList: any[] = [];
  dependencyList: any[] = [];

  dataDiary = {
    percentage: 0,
    allByDependency: [],
    total: 0,
    time_diff_total: '0',
  };
  firstDay: any;
  lastDay: any;

  people: any[];

  constructor(
    private _lateArrivals: LateArrivalsService,
    private _companies: CompanyService,
    private _grups: GroupService,
    private _dependencies: DependenciesService,
    private _people: PersonService
  ) {
    this.getGroup();
    this.getPeople();
    this.getCompanies();
  }

  ngOnInit() {
    let fecha = new Date();
    let hoy = fecha.toISOString().split('T')[0];
    this.lastDay = hoy;
    this.firstDay = new Date(fecha.setDate(fecha.getDate() - 2))
      .toISOString()
      .split('T')[0];
    this.getLateArrivals();
    this.getLinearDataset();
    this.getStatisticsByDays();
  }
  getData() {}
  getLateArrivals() {
    let params = this.getParams();
    this.loading = true;
    this._lateArrivals
      .getLateArrivals(this.firstDay, this.lastDay, params)
      .subscribe((r: any) => {
        this.companies = r.data;
        this.loading = false;
        this.transformData();
      });
  }
  downloadLateArrivals() {
    let params = this.getParams();
    this.donwloading = true;
    this._lateArrivals
      .downloadLateArrivals(this.firstDay, this.lastDay, params)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_llegadas_tarde';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloading = false;
      }),
      (error) => {
        console.log('Error downloading the file');
        this.donwloading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloading = false;
      };
  }

  getPeople() {
    this._people.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }
  getCompanies() {
    this._companies.getCompanies().subscribe((r: any) => {
      this.companyList = r.data;
      if (this.companyList.length > 1) {
        this.companyList.unshift({ text: 'Todas', value: '0' });
        this.company_id = 0;
      } else {
        this.company_id = this.companyList[0].value;
      }
    });
  }
  getGroup() {
    this._grups.getGroup().subscribe((r: any) => {
      this.groupList = r.data;
      this.groupList.unshift({ value: 0, text: 'Todos' });
      this.group_id = 0;
      this.getDependencies(0);
    });
  }
  getDependencies(group_id) {
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencyList = r.data;
      this.addElement();
    });
  }
  addElement() {
    this.dependencyList.unshift({ value: 0, text: 'Todas' });
    this.dependency_id = 0;
  }
  getLinearDataset() {
    let params = this.getParams();

    let fecha_inicio = moment().subtract(15, 'days').format('YYYY-MM-DD');
    let fecha_final = moment().format('YYYY-MM-DD');
    this._lateArrivals
      .getStatistcs(fecha_inicio, fecha_final, params)
      .subscribe((r: any) => {
        this.getLast15Days(r.data.lates);
      });
  }

  getParams() {
    let params: any = {};
    this.company_id != '0' && this.company_id
      ? (params.company_id = this.company_id)
      : '';

    this.group_id && this.group_id != '0'
      ? (params.group_id = this.group_id)
      : '';

    this.dependency_id != '0' && this.dependency_id
      ? (params.dependency_id = this.dependency_id)
      : '';
    this.people_id != '0' && this.people_id
      ? (params.person_id = this.people_id)
      : '';

    return params;
  }

  getLast15Days(lates: any[]) {
    this.lineChartData = [{ data: [], label: 'Llegadas tardes' }];
    this.lineChartLabels = [];
    for (let i = 0; i < 15; i++) {
      let day = moment().subtract(i, 'days').format('DD');
      let dayFinded = lates.find((l) => l.day == day);
      let data = dayFinded ? dayFinded.total : 0;
      this.lineChartData[0].data.unshift(data);
      this.lineChartLabels.unshift(day);
    }
  }
  getStatisticsByDays() {
    let params: any = this.getParams();
    params.type = 'diary';

    this._lateArrivals
      .getStatistcs(this.firstDay, this.lastDay, params)
      .subscribe((r: any) => {
        this.dataDiary.total = r.data.lates.total;
        this.dataDiary.time_diff_total = r.data.lates.time_diff_total;
        this.dataDiary.percentage = r.data.percentage;

        let d = r.data.allByDependency.reduce(
          (acc, el) => {
            return {
              labels: [...acc.labels, el.name],
              datasets: [...acc.datasets, el.total],
            };
          },
          { labels: [], datasets: [] }
        );

        this.donutChart.datasets[0].data = d.datasets;
        this.donutChart.labels = d.labels;
      });
  }

  transformData() {
    this.companies.forEach((c) => {
      c.groups.forEach((g) => {
        g.dependencies.forEach((d) => {
          d.people.forEach((pr) => {
            pr.averageTime = this.tiempoTotal(pr.late_arrivals);
          });
        });
      });
    });
  }

  tiempoEnMilisegundos(horaUno, horaDos) {
    let horaInicial = moment.utc(horaUno, 'HH:mm:ss');
    let horaFinal = moment.utc(horaDos, 'HH:mm:ss');
    if (horaFinal.isBefore(horaInicial)) {
      horaFinal.add(1, 'd');
    }

    let duracion = moment.duration(horaFinal.diff(horaInicial));
    return duracion.as('milliseconds');
  }

  tiempoTotal(llegadasTarde = []) {
    let total = llegadasTarde.length;
    let suma = 0;
    let promedio = 0;

    llegadasTarde.forEach((llegada) => {
      suma += this.tiempoEnMilisegundos(llegada.entry, llegada.real_entry);
    });
    //promedio = suma / total;
    promedio = suma;
    return moment.utc(promedio).format('HH:mm:ss');
  }
}
