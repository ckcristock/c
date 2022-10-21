import { Component, OnInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { BodegasService } from './bodegas.service.';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../services/swal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    private bodegaService: BodegasService,
    private _swal: SwalService,
    private modalService: NgbModal,
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
      mapa: ['']
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

  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.formBodega.reset();
  }

  getBodega(data) {
    this.bodega = { ...data };
    this.formBodega.patchValue({
      id: this.bodega.Id_Bodega_Nuevo,
      nombre: this.bodega.Nombre,
      direccion: this.bodega.Direccion,
      telefono: this.bodega.Telefono,
      compraInternacional: this.bodega.Compra_Internacional
    });
  }

  createBodega() {
    this.bodegaService.createBodega(this.formBodega.value)
      .subscribe((res: any) => {
        this.getBodegas();
        this.modalService.dismissAll();
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
          text: 'Aún no puedes editar una bodega con el mismo código, estamos trabajando en esto.',
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
          this.getBodegas();
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
