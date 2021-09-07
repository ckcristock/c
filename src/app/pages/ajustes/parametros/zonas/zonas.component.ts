import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Zones } from './zonas';
import { ZonasService } from './zonas.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss']
})
export class ZonasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  zones:any = [];
  zone: any ={};
  fb = new Zones();
  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  status:any = 'Inactivo';
  loading:boolean = false;
  constructor( private zonesService:ZonasService ) { }

  ngOnInit(): void {    
    this.getAllZones();
  }


  getAllZones( page = 1 ) {
    this.pagination.page = page;
    this.loading = true;
    this.zonesService.getAllZones( this.pagination)
    .subscribe( (res:any) => {
      this.loading = false;
      this.zones = res.data.data;
      this.pagination.collectionSize = res.data.total
    })
  }

  open(){
    this.modal.show();
    this.zone.id = '';
    this.zone.name = '';
  }
  
  getZone(zone){
    this.zone = {...zone};
  }
  anularOActivar(zone, status){

    let data:any = {
      id:zone.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'La zona se inactivará!' : 'La zona se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this.zonesService.createZone(data)
        .subscribe( res =>{
          this.getAllZones();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Zona Inhabilitada!' : 'Zona activada' ) ,
            text: (status === 'Inactivo' ? 'La zona ha sido Inhabilitada con éxito.' : 'La zona ha sido activada con éxito.'),
            icon: 'success'
          })
        } )
      }
    })
  }

  createZone() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false;}
      this.zonesService.createZone(this.zone)
      .subscribe( (res:any) => {
        this.getAllZones();
        this.modal.hide();
        Swal.fire({
          title: res.data,
          text: 'Felicidades, se ha agregado a las zonas.',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      } )
  }

  get name_valid(){
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

}
