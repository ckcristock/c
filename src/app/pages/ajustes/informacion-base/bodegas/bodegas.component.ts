import { Component, OnInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BodegasService } from './bodegas.service.';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';

import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
  styleUrls: ['./bodegas.component.scss']
})
export class BodegasComponent implements OnInit {
  @ViewChild('modalBodega') modalBodega: any;
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  formBodega: FormGroup;
  selected: any = '';
  closeResult = '';
  private bodega: any = {}
  public abrirCrear = new EventEmitter<any>();
  public loading: boolean = false;
  public filtros: any = {
    Nombre: '',
    Direccion: '',
    Telefono: '',
    Compra_Internacional: ''
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  bodegas: any[] = []
  filename: any = '';
  fileString: any = '';
  type: any = '';
  file: any = '';

  constructor(
    private bodegaService: BodegasService,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.getBodegas();
    this.createForm();
  }

  createForm() {
    this.formBodega = this.fb.group({
      id: [this.bodega.Id_Bodega_Nuevo],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      compraInternacional: ['', Validators.required],
      mapa: [''],
      typeMapa: ['']
    });
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  openConfirm(confirm, titulo) {
    this.selected = titulo;
    this._modal.open(confirm);
    this.formBodega.reset();
    this.file="";
    this.type="";
    this.bodega = this.formBodega.value;
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
      this.filename = file.name;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.formBodega.patchValue({
          mapa: this.file,
          typeMapa: this.type
        })
      });

    }
  }

  getBodega(data) {
    this.bodega = { ...data };
    this.formBodega.patchValue({
      id: this.bodega.Id_Bodega_Nuevo,
      nombre: this.bodega.Nombre,
      direccion: this.bodega.Direccion,
      telefono: this.bodega.Telefono,
      compraInternacional: this.bodega.Compra_Internacional,
      mapa: this.bodega.Mapa
    });
  }

  createBodega() {
    this.bodegaService.createBodega(this.formBodega.value)
      .subscribe((res: any) => {
        this.getBodegas(this.pagination.page);
        this._modal.close();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado la bodega con éxito.',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: err.error.text,
          icon: 'error',
          showCancel: false,
        })
      }
      );
  }

  getBodegas(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this.bodegaService.getBodegas(params).subscribe((res: any) => {
      this.bodegas = res.data.data;
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
    })
  }

  cambiarEstado(bodega, state) {
    let data = {
      id: bodega.Id_Bodega_Nuevo,
      modulo: 'bodega',
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (bodega.Estado == 'Activo' ? '¡La bodega será desactivada!' : '¡La bodega será activada!'),
      icon: 'question',
      showCancel: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.bodegaService.activarInactivar(data).subscribe((r: any) => {
          this.getBodegas(this.pagination.page);
        })
        this._swal.show({
          icon: 'success',
          title: 'Tarea completada con éxito!',
          text: (bodega.Estado == 'Inactivo' ? 'La bodega ha sido activada con éxito.' : 'La bodega ha sido desactivada con éxito.'),
          timer: 1000,
          showCancel: false
        })
      }
    })
  }
}
