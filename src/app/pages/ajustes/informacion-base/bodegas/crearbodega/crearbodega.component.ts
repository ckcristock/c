import { Component, EventEmitter, OnInit, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crearbodega',
  templateUrl: './crearbodega.component.html',
  styleUrls: ['./crearbodega.component.scss']
})
export class CrearbodegaComponent implements OnInit {
  @Input('abrirCrear') abrirCrear : EventEmitter<any>;
  @Output('CargarBodegas') cargarBodegas = new EventEmitter<any>();
  @ViewChild('modalBodega') modalBodega ;
  @ViewChild('Mapa') Mapa:ElementRef ;
  @ViewChild('infoSwal') infoSwal:any ;
  
  public bodega:any = {
    Nombre:'',
    Direccion:'',
    Telefono:'',
    Mapa:'',
    Compra_Internacional:''
  }

  public tipo = '';

  constructor() { }

  ngOnInit() {
    this.abrirCrear.subscribe(event=>{
      this.tipo=event.Tipo;
      if(event.Bodega){
        this.bodega=event.Bodega;
      }else{
        this.setBodega();
      }
      this.modalBodega.show();
    })
  }
/* 
  guardarBodega(){
    
    let data = new FormData();
    let mapa ;
    if (this.Mapa.nativeElement.files.length === 1) {     
      mapa = this.Mapa.nativeElement.files[0];
      data.append('mapa',mapa);

    }else if(this.tipo == 'Crear'){

      this.infoSwal.type='warning';
      this.infoSwal.title = "Falta el archivo";
      this.infoSwal.text = 'La imágen del mapa es obligatoria'; 
      this.infoSwal.show();
      return ''
    }


    data.append('bodega',JSON.stringify( this.bodega) );
    data.append('tipo',this.tipo);

    this.http.post(this.globales.ruta+'php/bodega_nuevo/crear_bodega_nuevo.php',data).subscribe(
      ok=>{
        this.infoSwal.type='success';
        this.infoSwal.title = "Operación realizada satisfactoriamente";
        this.infoSwal.text = ok['message']; 
        this.infoSwal.show();
        this.modalBodega.hide();

        this.cargarBodegas.emit(true);

        
      },err=>{
        this.infoSwal.type='error';
        this.infoSwal.title = "Ha ocurrido un error";
        this.infoSwal.text = err.error.message; 
        this.infoSwal.show();

      });
  

  }
 */
  setBodega(){
    this.bodega = {
      Nombre:'',
      Direccion:'',
      Telefono:'',
      Mapa:'',
      Compra_Internacional:''
    }
  }
  

}
