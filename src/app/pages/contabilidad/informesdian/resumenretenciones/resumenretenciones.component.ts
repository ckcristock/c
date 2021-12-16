import { Component, OnInit } from '@angular/core';
import { Globales } from '../../globales';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-resumenretenciones',
  templateUrl: './resumenretenciones.component.html',
  styleUrls: ['./resumenretenciones.component.scss']
})
export class ResumenretencionesComponent implements OnInit {

  public datosCabecera:any = {
    Titulo: 'Resumen de Retenciones',
    Fecha: new Date()
  }
  public model:any = {
    Fecha_Inicio: '',
    Fecha_Fin: '',
    Tipo_Retencion: 'Retefuente',
    Tipo_Reporte: 'Pcga'
  }
  queryParams: string;

  constructor(private globales: Globales, private http: HttpClient) { }

  ngOnInit() {
  }

  setQueryParams() {
    let params:any = {};

    for (const key in this.model) {
      params[key] = this.model[key];
    }

    this.queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  }
  
  generarResumen() {
    window.open(environment.ruta+'php/contabilidad/resumenretenciones/reporte.php?'+this.queryParams,'_blank');
  }


}
