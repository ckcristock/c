import { Component, OnInit } from '@angular/core';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { ApuPiezaService } from '../apu-pieza/apu-pieza.service';
import { ApuConjuntoService } from './apu-conjunto.service';

@Component({
  selector: 'app-apu-conjunto',
  templateUrl: './apu-conjunto.component.html',
  styleUrls: ['./apu-conjunto.component.scss']
})
export class ApuConjuntoComponent implements OnInit {
  apuSets:any[] = [];
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
              private _apuSets: ApuConjuntoService,
              private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getApuSets();
  }

  getApuSets(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._apuSets.getApuSets(params).subscribe((r:any) => {
      this.apuSets = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  activateOrInactive(state, id){
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (state == 'Inactivo' ? '¡El APU Conjunto será inactivado!': '¡El APU Conjunto será activado!')
    }).then((r) =>{
      if (r.isConfirmed) {
        this._apuSets.activateOrInactivate({state: state, id}).subscribe((r:any) => {
          this.getApuSets();
          this._swal.show({
              icon: 'success',
              title: 'Proceso Satisfactio',
              text: (state == 'Inactivo' ? 'El APU Conjunto ha sido inactivado.' : 'El APU Conjunto ha sido Activado.'),
              showCancel: false
          }); 
        });
      }
    });
  }

}
