import { Component, OnInit } from '@angular/core';
import { ApuServicioService } from './apu-servicio.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-apu-servicio',
  templateUrl: './apu-servicio.component.html',
  styleUrls: ['./apu-servicio.component.scss']
})
export class ApuServicioComponent implements OnInit {
  apuService:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    creation_date: ''
  }
  constructor(
              private _apuService: ApuServicioService,
              private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getApuServices();
  }

  getApuServices(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._apuService.getApuServices(params).subscribe((r:any) => {
      this.apuService = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  activateOrInactive(state, id){
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (state == 'Inactivo' ? '¡El APU Servicio será inactivado!': '¡El APU Servicio será activado!')
    }).then((r) =>{
      if (r.isConfirmed) {
        this._apuService.activateOrInactivate({state: state, id}).subscribe((r:any) => {
          this.getApuServices();
          this._swal.show({
              icon: 'success',
              title: 'Proceso Satisfactio',
              text: (state == 'Inactivo' ? 'El APU Servicio ha sido inactivado.' : 'El APU Servicio ha sido Activado.'),
              showCancel: false
          }); 
        });
      }
    });
  }
}
