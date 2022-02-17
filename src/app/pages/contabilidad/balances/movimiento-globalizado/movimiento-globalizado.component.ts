import { Component, OnInit } from '@angular/core';
import { MovimientoGlobalizadoModel } from './MovimientoGlobalizadoModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-movimiento-globalizado',
  templateUrl: './movimiento-globalizado.component.html',
  styleUrls: ['./movimiento-globalizado.component.scss']
})
export class MovimientoGlobalizadoComponent implements OnInit {

  public datosCabecera:any = {
    Titulo: 'Movimientos Globalizados',
    Fecha: new Date()
  }

  public MovimientoGlobalizadoModel:MovimientoGlobalizadoModel = new MovimientoGlobalizadoModel();
  queryParams: string;
  public listaTiposDocumentos:any = [];
  public TerceroSeleccionado:any;
  private _rutaBase:string = environment.ruta+'php/terceros/';
  terceros:any[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.tiposDocumentos('Normal');
    this.FiltrarTerceros().subscribe((data:any) => {
      this.terceros = data;
    })
  }

  search_tercero = (text$: Observable<string>) =>
  text$
  .pipe(
    debounceTime(200),
    map(term => term.length < 4 ? []
        : 
        this.terceros.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
  );

    FiltrarTerceros():Observable<any>{
      // let p = {coincidencia:match};
      return this.http.get(this._rutaBase+'filtrar_terceros.php');
    }

  formatter_tercero = (x: { Nombre_Tercero: string }) => x.Nombre_Tercero;

  AsignarTercero(model){
    
    if (typeof(model) == 'object') {

      this.MovimientoGlobalizadoModel.Nit = model.Nit;      
    }else{
      this.MovimientoGlobalizadoModel.Nit = '';
    }

    this.setQueryParams();

  }

  setQueryParams() {

    let params:any = {};
      
    if (this.MovimientoGlobalizadoModel.Fecha_Inicial != '') {
      params.Fecha_Inicial = this.MovimientoGlobalizadoModel.Fecha_Inicial
    }
    if (this.MovimientoGlobalizadoModel.Fecha_Corte != '') {
      params.Fecha_Corte = this.MovimientoGlobalizadoModel.Fecha_Corte;
    }
    if (this.MovimientoGlobalizadoModel.Nit != '') {
      params.Nit = this.MovimientoGlobalizadoModel.Nit
    }
    if (this.MovimientoGlobalizadoModel.Fuente != '') {
      params.Fuente = this.MovimientoGlobalizadoModel.Fuente
    }
    if (this.MovimientoGlobalizadoModel.Estado != '') {
      params.Estado = this.MovimientoGlobalizadoModel.Estado
    }
  
    this.queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    
    
  }

  tiposDocumentos(tipo) {
    let p:any = tipo != null && tipo != undefined ? {Tipo: 'Normal'} : {};
    this.http.get(environment.ruta+'php/contabilidad/tipos_documentos.php',{params: p})
    .subscribe((data:any) => {
      this.listaTiposDocumentos = data;
    })
  }

  generarReporte() {
    window.open(environment.ruta+'php/contabilidad/movimientoglobalizado/generar_reporte.php?'+this.queryParams,'_blank');
  }
}
