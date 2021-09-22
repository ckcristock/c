  import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TiposNovedadesService } from './tipos-novedades.service';
import { consts } from '../../../../core/utils/consts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipos-novedades',
  templateUrl: './tipos-novedades.component.html',
  styleUrls: ['./tipos-novedades.component.scss']
})
export class TiposNovedadesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  selected:any;
  form:FormGroup;
  novelties:any[] = [];
  private novelty:any = {};
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    novelty: '',
  }
  modalities = consts.modalities;
  constructor( private _tiposNovedadesService: TiposNovedadesService, private fb: FormBuilder ) { }
  
  ngOnInit(): void {
    this.getNovelties();
    this.createForm();
  }

  openModal() {
    this.modal.show();
    this.form.reset();
    this.selected = 'Nuevo Tipo de Novedad';
  }

  getData(data) {
    this.novelty = {...data};
    this.selected = 'Actualizar Tipo de Novedad';
    this.form.patchValue({
      id: this.novelty.id,
      concept: this.novelty.concept,
      novelty: this.novelty.novelty,
      modality: this.novelty.modality
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.novelty.id],
      concept: [''],
      novelty: [''],
      modality: ['']
    });
  }

  getNovelties( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tiposNovedadesService.getNovelties(params)
    .subscribe( (res:any) => {
      this.novelties = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  createNovelty() {
      this._tiposNovedadesService.createNovelty(this.form.value)
      .subscribe( (res:any) => {
      this.modal.hide();
      this.getNovelties();
        Swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Proceso realizado satisfactoriamente'
        })
      })
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo'? 'La novedad se inactivará!' : 'La novedad se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: ( status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar' )
    }).then((result) => {
      if (result.isConfirmed) {
        this._tiposNovedadesService.createNovelty(data)
        .subscribe( res => {
          this.getNovelties();
          Swal.fire({
            title: (status === 'Inactivo' ? 'Novedad Inhabilitado!' : 'Novedad activado' ),
            text: (status === 'Inactivo' ? 'La novedad ha sido Inhabilitada con éxito.' : 'La novedad ha sido activada con éxito.'),
            icon: 'success'
          });
        });
      }
    });
  }

}
