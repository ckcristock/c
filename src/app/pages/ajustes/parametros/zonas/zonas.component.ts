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
  constructor( private zonesService:ZonasService ) { }

  ngOnInit(): void {    
    this.getAllZones();
  }


  getAllZones( page = 1 ) {
    this.pagination.page = page;
    this.zonesService.getAllZones( this.pagination)
    .subscribe( (res:any) => {
      this.zones = res.data.data;
      this.pagination.collectionSize = res.data.total
      console.log(this.zones);
    })
  }
  open(){
    this.modal.show();
    this.zone.id = '';
    this.zone.name = '';
  }
  getZone(zone){
    this.zone = zone;
  }

  createZone() {
    if(this.form.valid){
      this.zonesService.createZone(this.zone)
      .subscribe( res => {
        this.getAllZones();
        this.modal.hide();
        Swal.fire({
          title: 'Operación exitosa',
          text: 'Felicidades, se han actualizado las zonas',
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      } )

    }

  }

}
