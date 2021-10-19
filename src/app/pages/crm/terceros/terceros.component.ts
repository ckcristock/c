import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  form:FormGroup;
  parametro:string = '';
  loading:boolean = false;
  thirdParties:any[] = [];
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    nit: '',
    name: '',
    third_party_type: ''
  }
  constructor( 
                private _tercerosService: TercerosService, private fb: FormBuilder,
                public router: Router,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getThirdParties();
  }

  getThirdParties(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tercerosService.getThirdParties(params).subscribe((r:any) => {
      this.thirdParties = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  changeState(third, state){
    let data = {
      id: third.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El Tercero se Anulará!': '¡El Tercero se Activará!')
    }).then((r) =>{
      if (r.isConfirmed) {
        this._tercerosService.changeState(data).subscribe((r:any) =>{
        this.getThirdParties();
        this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactio',
            text: (data.state == 'Inactivo' ? 'El tercero ha sido Anulado.' : 'El tercero ha sido Activado.'),
            showCancel: false
        }); 
        });
      }
    });
  }



}
