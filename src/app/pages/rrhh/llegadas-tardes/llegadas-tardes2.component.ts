import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { donutChart } from './data'
import { ChartType } from '../../../core/interfaces/chart.interface';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
@Component({
  selector: 'app-llegadas-tardes',
  templateUrl: './llegadas-tardes.component.html',
  styleUrls: ['./llegadas-tardes.component.scss']
})
export class LlegadasTardesComponent implements OnInit {
  groups: any[];
  dependencies: any[];
  pdfUrl = ''
  constructor(
    private _groups: GroupService,
    private _dependencies: DependenciesService,
  ) {

  }
  ngOnInit() {
    this._groups.getGroup().subscribe((r: any) => {
      this.groups = r.data
      this.groups.unshift({text:'Todos',value:''})
    })
  }

  getDependencies(group_id){
    if (group_id) {
      this._dependencies.getDependencies({group_id}).subscribe((r:any)=>{
        this.dependencies = r.data;
        this.dependencies.unshift({text:'Todas',value:''})
      })
    }
  }

  filtrar(group_id,dependency_id){
  }

  filtrarPorFecha(date1, date2) {

  }
  descargarReporteExcel(){

  }

  get totalLlegadasTarde(){
    return 0
  }
  get tiempoAcumuladoLlegadas(){
    return 0
  }
}
