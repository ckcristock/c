import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from './apu-pieza.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-apu-pieza',
  templateUrl: './apu-pieza.component.html',
  styleUrls: ['./apu-pieza.component.scss']
})
export class ApuPiezaComponent implements OnInit {
  apuParts:any[] = [];
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
                private _apuParts: ApuPiezaService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getApuParts();
  }

  getApuParts(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._apuParts.apuPartPaginate(params).subscribe((r:any) => {
      this.apuParts = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  activateOrInactive(state, id){
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (state == 'Inactivo' ? '¡El APU Pieza será inactivado!': '¡El APU Pieza será activado!')
    }).then((r) =>{
      if (r.isConfirmed) {
        this._apuParts.activateOrInactivate({state: state, id}).subscribe((r:any) => {
          this.getApuParts();
          this._swal.show({
              icon: 'success',
              title: 'Proceso Satisfactio',
              text: (state == 'Inactivo' ? 'El APU Pieza ha sido inactivado.' : 'El APU Pieza ha sido Activado.'),
              showCancel: false
          }); 
        });
      }
    });
  }

}
