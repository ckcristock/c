import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TiposNovedadesService } from './tipos-novedades.service';
import { consts } from '../../../../core/utils/consts';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

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
  constructor(private _tiposNovedadesService: TiposNovedadesService, private fb: FormBuilder, private modalService: NgbModal,) { }

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
      text: (status === 'Inactivo' ? 'La novedad se inactivará!' : 'La novedad se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: (status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar')
    }).then((result) => {
      if (result.isConfirmed) {
        this._tiposNovedadesService.createNovelty(data)
          .subscribe(res => {
            this.getNovelties();
            Swal.fire({
              title: (status === 'Inactivo' ? 'Novedad Inhabilitado!' : 'Novedad activado'),
              text: (status === 'Inactivo' ? 'La novedad ha sido Inhabilitada con éxito.' : 'La novedad ha sido activada con éxito.'),
              icon: 'success'
            });
          });
      }
    });
  }

}
