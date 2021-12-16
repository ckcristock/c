import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CustometypeaheadService } from './custometypeahead.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-custumetypeahead',
  templateUrl: './custumetypeahead.component.html',
  styleUrls: ['./custumetypeahead.component.scss']
})
export class CustumetypeaheadComponent implements OnInit {

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.Campo.currentValue!=undefined){
 
      this.Model=changes.Campo.currentValue
    }
   }
 
   public Model:any='';
   public Id:any='';
   constructor( private _custome:CustometypeaheadService, private swalService: SwalService) { }
   @Input() Modelo;
   @Input() Ruta;
   @Input() Campo;
   @Output() RetornarId:EventEmitter<string>=new EventEmitter<string>();
   ngOnInit() {
   }
   search_tercero = (text$: Observable<string>) =>
   text$
   .pipe(
     debounceTime(200),
     distinctUntilChanged(),
     switchMap( term => term.length <= 2 ? [] :
       this._custome.Filtrar(term,this.Ruta)
       .map(response => response)
     )
   );
 
 formatter_tercero = (x: { Nombre: string }) => x.Nombre;
 
 AsignarId(){  
   if (typeof(this.Model) == 'object') {
 
     this.Id = this.Model.Id;   
     
   }else{
     this.Id = '';
   }
   
   this.RetornarId.emit(this.Id);  
    
 }
 
 validarCampo(campo, event, tipo) { // Funcion que validará los campos de typeahead
   if (typeof(campo) != 'object' && campo != '') {
     let id = event.target.id;
     (document.getElementById(id) as HTMLInputElement).focus();
     let swal = {
       icon: 'error',
       titulo: 'Incorrecto!',
       mensaje: `El valor ${tipo} no es valido.`
     };
     this.swalService.ShowMessage(swal);
   }
 }

}
