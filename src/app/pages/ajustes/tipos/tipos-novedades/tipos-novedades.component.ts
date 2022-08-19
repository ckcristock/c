import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TiposNovedadesService } from './tipos-novedades.service';
import { consts } from '../../../../core/utils/consts';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-tipos-novedades',
  templateUrl: './tipos-novedades.component.html',
  styleUrls: ['./tipos-novedades.component.scss']
})
export class TiposNovedadesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  selected: any;
  form: FormGroup;
  novelties: any[] = [];
  private novelty: any = {};
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros: any = {
    novelty: '',
  }
  modalities = consts.modalities;
  constructor(
    private _tiposNovedadesService: TiposNovedadesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getNovelties();
    this.createForm();
  }

  openModal() {
    this.modal.show();


  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  getData(data) {
    this.novelty = { ...data };
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

  getNovelties(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tiposNovedadesService.getNovelties(params)
      .subscribe((res: any) => {
        this.novelties = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  createNovelty() {
    this._tiposNovedadesService.createNovelty(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll();
        this.getNovelties();
        this._swal.show({
          title: res.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta nuevamente',
          icon: 'error',
          showCancel: false,
        })
      })
  }

  activateOrInactivate(novelty, status) {
    let data = {
      id: novelty.id,
      status
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (status === 'Inactivo' ? '¡La novedad se inactivará!' : '¡La novedad se activará!'),
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._tiposNovedadesService.createNovelty(data)
          .subscribe(res => {
            this.getNovelties();
            this._swal.show({
              title: (status === 'Inactivo' ? '¡Novedad inhabilitada!' : '¡Novedad activada!'),
              text: (status === 'Inactivo' ? 'La novedad ha sido inhabilitada con éxito.' : 'La novedad ha sido activada con éxito.'),
              icon: 'success',
              showCancel: false,
              timer: 1000
            }) 
          });
      }
    });
  }

}
