import { Component, OnInit } from '@angular/core';
import {CrearViaticosService} from './crear-viaticos/crear-viaticos.service';
import { PermissionService } from '../../../core/services/permission.service';
import { Permissions } from '../../../core/interfaces/permissions-interface';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss']
})
export class ViaticosComponent implements OnInit {
  data:any[] = [];
  people:any[] = [];
  person_selected:any;
  loading:boolean = false;
  permission: Permissions = {
    menu: 'Viáticos',
    permissions: {
      approve: false
    }
  };
  filtros:any = {
    person_id: '',
    creation_date: '',
    departure_date: '',
    state: ''
  }
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  states:any = [
    { clave: 'Todos' },
    { clave: 'Pendiente' },
    { clave: 'Aprobado' },
    { clave: 'Legalizado' },
    { clave: 'Activo' },
    { clave: 'Inactivo' }
  ]
  constructor( private _viaticos:CrearViaticosService, private _permission: PermissionService, private _swal: SwalService ) {
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    this.getAll();
    this.getPeople();
  }
  
  tipo(){
    let value = this.filtros.person_id;
    if (typeof value == 'object') {
      this.filtros.person_id = value.value;
    } else {
      return;
    }
  }
  
  getAll( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._viaticos.getAllViaticos(params).subscribe( (r:any)=>{
      this.data = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  getPeople(){
    this._viaticos.getPeopleXSelect().subscribe( (r:any) =>{
      this.people = r.data;
    })
  }

  changeState( viatico, state ) {
    let data = {
      id: viatico.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: '¡El Viatico será aprobado',
      icon: 'question',
      showCancel: true
    })
    .then((result) =>{
      if (result.isConfirmed) {
        this._viaticos.changeState(data, data.id).subscribe( (r:any) =>{
          this.getAll();
          this._swal.show({
            icon: 'success',
            title: 'El Viatico Ha sido Aprobado!',
            text: '¡Aprobado!',
            timer: 2500,
            showCancel: false
          })
        })
      }
    })
  }

}
