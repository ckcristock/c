import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { CustometypeaheadService } from './custometypeahead.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-custumetypeahead',
  templateUrl: './custumetypeahead.component.html',
  styleUrls: ['./custumetypeahead.component.scss']
})
export class CustumetypeaheadComponent implements OnInit {

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.Campo.currentValue!=undefined){
 
      this.Model=changes.Campo.currentValue
      // console.log(this.Ruta);
      this.datosObtenidos();
    }
   }
 
   public Model:any='';
   public Id:any='';
   datos:any[] = [];
   constructor( 
                private _custome:CustometypeaheadService, private swalService: SwalService,
                private http: HttpClient
              ) { }
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
    map(term => term.length < 4 ? []
        : 
        this.datos.filter(v => v.Nombre.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
     /* debounceTime(200),
     distinctUntilChanged(),
     switchMap( term => term.length <= 2 ? [] :
       this.Filtrar(term,this.Ruta)
       .map(response => response)
     ) */
   );
 
 formatter_tercero = (x: { Nombre: string }) => x.Nombre;

  datosObtenidos(){
    this.Filtrar().subscribe((data:any) => {
      this.datos = data;
    })
  }

 Filtrar():Observable<any>{
  // let p = {coincidencia:match};
  return this.http.get(environment.ruta+this.Ruta);
}
 
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
    //  let id = event.target.id;
     Swal.fire({
       icon: 'error',
       title: 'Incorrecto!',
       text: `El valor ${tipo} no es valido.`
     })
    //  this.swalService.ShowMessage(swal);
   }
 }

}
