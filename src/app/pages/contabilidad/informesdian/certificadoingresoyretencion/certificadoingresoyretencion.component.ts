import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Globales } from '../../globales';
import { HttpClient } from '@angular/common/http';
import { CertificadoRetencionModel } from '../certificadoretencion/CertificadoRetencionModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-certificadoingresoyretencion',
  templateUrl: './certificadoingresoyretencion.component.html',
  styleUrls: ['./certificadoingresoyretencion.component.scss']
})
export class CertificadoingresoyretencionComponent implements OnInit {

  public datosCabecera:any = {
    Titulo: 'Ingreso y retención',
    Fecha: new Date()
  }
  public CertificadoRetencionModel: CertificadoRetencionModel = new CertificadoRetencionModel();
  public TerceroSeleccionado:any;
  queryParams: string;
  private _rutaBase:string = environment.ruta+'php/terceros/';
  terceros:any[] = [];
  
  constructor(private globales: Globales, private http: HttpClient) { }

  ngOnInit() {
    this.FiltrarTerceros().subscribe((data:any) => {
      this.terceros = data;
    })
  }

  search_tercero = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    map(term => term.length < 4 ? []
      : this.terceros.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
  );
  formatter_tercero = (x: { Nombre: string }) => x.Nombre;

AsignarTercero(model){
    
  if (typeof(model) == 'object') {

    this.CertificadoRetencionModel.Nit = model.Nit;      
    this.CertificadoRetencionModel.Tipo_Nit = model.Tipo;      
  }else{
    this.CertificadoRetencionModel.Nit = '';
    this.CertificadoRetencionModel.Tipo_Nit = '';
  }

  this.setQueryParams();

}

FiltrarTerceros():Observable<any>{
  // let p = {coincidencia:match};
  return this.http.get(this._rutaBase+'filtrar_terceros.php');
}

setQueryParams() {

  let params:any = {};
    
  if (this.CertificadoRetencionModel.Fecha_Inicial != '') {
    params.Fecha_Inicial = this.CertificadoRetencionModel.Fecha_Inicial
  }
  if (this.CertificadoRetencionModel.Fecha_Final != '') {
    params.Fecha_Final = this.CertificadoRetencionModel.Fecha_Final
  }

  if (this.CertificadoRetencionModel.Cuentas != '') {
    params.Cuentas = this.CertificadoRetencionModel.Cuentas.join(',');
  }
  if (this.CertificadoRetencionModel.Nit != '') {
    params.Nit = this.CertificadoRetencionModel.Nit
  }
  if (this.CertificadoRetencionModel.Tipo_Nit != '') {
    params.Tipo_Nit = this.CertificadoRetencionModel.Tipo_Nit
  }
  if (this.CertificadoRetencionModel.Fecha_Expedicion != '') {
    params.Fecha_Expedicion = this.CertificadoRetencionModel.Fecha_Expedicion
  }

  this.queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  
  
}

generarCertificado() {
  
  window.open(environment.ruta+'php/contabilidad/certificadoingresoretencion/certificado.php?'+this.queryParams,'_blank');
}

}
