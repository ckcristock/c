import { Component, OnInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
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

  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  title: any =''
  closeResult = '';
  public openConfirm(confirm, type) {
    this.title = type;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    
  }

  bodegas: any[] = []

  constructor(
    private bodegaService: BodegasService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) {
    
  }

  ngOnInit(): void {
    this.getBodegas();
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

  /* eliminarBodega(id) {

    let data = new FormData();
    data.append('id', id);

    this.http.post(this.globales.ruta + 'php/bodega_nuevo/eliminar_bodega.php', data).subscribe((res: any) => {
      this.deleteSwal.type = res['type'];
      this.deleteSwal.title = res['title'];
      this.deleteSwal.text = res['message'];
      this.deleteSwal.show();
      this.getBodegas();

    }, err => {
      this.deleteSwal.type = err.error.type;
      this.deleteSwal.title = err.error.title;
      this.deleteSwal.text = err.error.message;
      this.deleteSwal.show();
    })
  } */
  
  cambiarEstado(bodega, state){
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
