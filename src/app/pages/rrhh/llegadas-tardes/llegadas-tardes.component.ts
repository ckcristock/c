import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { donutChart } from './data'
/* import { ChartType } from '../../../core/interfaces/chart.interface'; */
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as moment from 'moment';
import { LateArrivalsService } from './late-arrivals.service';
@Component({
  selector: 'app-llegadas-tardes',
  templateUrl: './llegadas-tardes.component.html',
  styleUrls: ['./llegadas-tardes.component.scss']
})
export class LlegadasTardesComponent implements OnInit {
  donutChart = donutChart;


  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 60, 85, 90], label: 'Series A' },

  ];
  public lineChartLabels: Label[] = [];

  public lineChartColors: Color[] = [

    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  /* public lineChartPlugins = [pluginAnnotations]; */

  /**
 * 
 * 
 * 
 */

  public Cargando = true;
  public companies: any = [];

  firstDay: any;
  lastDay: any

  mes: any = [];


  constructor(
    private _lateArrivals:LateArrivalsService
   ) {
    this.getLast15Days()
  }

  
  ngOnInit() {
    
    let fecha = new Date();
    let hoy = (fecha.toISOString()).split('T')[0];
    this.lastDay = hoy;
    this.firstDay = (new Date(fecha.setDate(fecha.getDate() - 2))).toISOString().split("T")[0];
    this.getLateArrivals();
    
  }
  getLateArrivals(){
    this._lateArrivals.getLateArrivals(this.firstDay,this.lastDay)
      .subscribe( (r:any)=>{
        this.companies = r.data
        this.transformData()
      })
  }

  transformData(){
    let totalPeople = 0;
    this.companies.forEach(c => {
      c.groups.forEach(g => {
        g.dependencies.forEach(d => {
            d.people.forEach(pr=>{
              pr.averageTime = this.tiempoPromedio( pr.late_arrivals)
            })
          });
      });
    });
    
  }
  
  tiempoEnMilisegundos(horaUno, horaDos) {
    let horaInicial = moment.utc(horaUno, "HH:mm:ss");
    let horaFinal = moment.utc(horaDos, "HH:mm:ss");
    if (horaFinal.isBefore(horaInicial)) {
      horaFinal.add(1, "d");
    }

    let duracion = moment.duration(horaFinal.diff(horaInicial));
    return duracion.as("milliseconds");
  }

  tiempoPromedio(llegadasTarde = []) {
    let total = llegadasTarde.length;
    let suma = 0;
    let promedio = 0;

    llegadasTarde.forEach(llegada => {
      suma += this.tiempoEnMilisegundos(
        llegada.entry,
        llegada.real_entry
      );
    });
    promedio = suma / total;
    return moment.utc(promedio).format("HH:mm:ss");
  }

  
  getLast15Days() {
    for (let i = 0; i < 6; i++) {
      let today = moment();
      let day = today.subtract(i, 'days');
      this.lineChartLabels.unshift(day.format('DD'));
    }
  }

  getFecha(tipo) {

    let date = new Date(), y = date.getFullYear(), m = date.getMonth();
    let Fecha: any;

    if (tipo == 'inicial') {
      Fecha = new Date(y, m, 1);
      //Fecha=new Date();
    } else if (tipo == 'final') {
      Fecha = new Date(y, m + 1, 0);
    }

    let mes = Fecha.getMonth() < 10 ? '0' + parseInt(Fecha.getMonth() + 1) : Fecha.getMonth() + 1;
    let dia = Fecha.getDate() < 10 ? '0' + Fecha.getDate() : Fecha.getDate();

    return Fecha.getFullYear() + '-' + mes + '-' + dia;
  }



  getQueryString() {

    let params: any = {};
    let queryString = '';

 
    if (this.lastDay != '') {
      params.fecha_fin = this.lastDay;
    }
    if (this.firstDay != '') {
      params.fecha_inicio = this.firstDay;
    }

    queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;

  }

}
