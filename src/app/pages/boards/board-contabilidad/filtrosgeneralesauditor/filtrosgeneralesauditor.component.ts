import { Component, OnInit, Input } from '@angular/core';
import { BoardContabilidadService } from '../board-contabilidad.service';

import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-filtrosgeneralesauditor',
  templateUrl: './filtrosgeneralesauditor.component.html',
  styleUrls: ['./filtrosgeneralesauditor.component.scss']
})
export class FiltrosgeneralesauditorComponent implements OnInit {
  @Input() MostrarFiltrosAdicionales:boolean = false;

  public TerceroSeleccionado:any = '';

  constructor(private _boardService: BoardContabilidadService) { }

  public Filtros:any={
    Fecha_Inicio:'',
    Fecha_Fin:'',
    Tercero:''
  }
  ngOnInit() {
    this.StartDate();
  }

  StartDate(){
    var fecha = new Date();
    this.Filtros.Fecha_Fin = fecha.toISOString().split("T")[0];
    var dia = new Date(fecha.setDate(fecha.getDate() - 30));
    this.Filtros.Fecha_Inicio = dia.toISOString().split("T")[0];
    setTimeout(() => {
      this.EnviarParametros();
    }, 1000);
   
  }
  EnviarParametros(){
    let parametros = this.SetFiltros();    
    this._boardService._subject.next(parametros);
  }

  ValidarFecha(){
 
    
    if(this.Filtros.Fecha_Fin!='' && this.Filtros.Fecha_Inicio!=''){
        if (this.Filtros.Fecha_Inicio<=this.Filtros.Fecha_Fin  ) {
          this.EnviarParametros();
        }else{
          this._boardService.ShowMessage([
            "warning","Error en las Fechas", "La fecha de inicio no puede ser mayor a la fecha de fin por favor revise."
          ]);
          this.Filtros.Fecha_Fin='';
        }
    }    
  }

SetFiltros() {  
  let params:any = {};

  if (this.Filtros.Fecha_Inicio.trim() != "") {
    params.fini = this.Filtros.Fecha_Inicio;
  }

  if (this.Filtros.Fecha_Fin.trim() != "") {
    params.ffin = this.Filtros.Fecha_Fin;
  }

  if (this.MostrarFiltrosAdicionales) {
    if (this.Filtros.Tercero.trim() != "") {
      params.nit = this.Filtros.Tercero;
    }
  }

  let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');  
  return queryString;
}

  search_tercero = (text$: Observable<string>) =>
    text$
    .pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( term => term.length < 4 ? [] :
        this._boardService.FiltrarTerceros(term)
        .map(response => response)
      )
    );

  formatter_tercero = (x: { Nombre_Tercero: string }) => x.Nombre_Tercero;

  AsignarTercero(){
    
    if (typeof(this.TerceroSeleccionado) == 'object') {

      this.Filtros.Tercero = this.TerceroSeleccionado.Nit;      
    }else{
      this.Filtros.Tercero = '';
    }
    

    this.EnviarParametros();
  }

}
