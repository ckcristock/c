import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { camposTerceros } from './campos-terceros';
import { CamposTercerosService } from './campos-terceros.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-campos-terceros',
  templateUrl: './campos-terceros.component.html',
  styleUrls: ['./campos-terceros.component.scss']
})
export class CamposTercerosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  tipos = camposTerceros.tipos;
  fields: any[] = [];
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }
  filtro: any = {
    code: '',
  }

  constructor(
    private fb: FormBuilder,
    private _field: CamposTercerosService,
    private _swal: SwalService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getFields();
  }

  openModal() {
    this.modal.show();
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  openConfirm(content) {
    this._modal.open(content)
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      length: ['']
    })
  }

  getFields(page = 1) {
    this.pagination.page = page
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._field.getFields(params).subscribe((r: any) => {
      this.loading = false;
      this.fields = r.data.data;
      this.pagination.collectionSize = r.data.total
    })
  }

  save() {
    this._field.save(this.form.value).subscribe((r: any) => {
      this._modal.close();
      this.form.reset();
      this.getFields();
      this._swal.show({
        title: r.data,
        icon: 'success',
        text: '',
        timer: 1000,
        showCancel: false
      })
    })
  }

  changeState(id, state) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: (state == 'Inactivo' ? '¡El campo se anulará!' : '¡El campo se activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._field.changeState({ state: state }, id).subscribe((r: any) => {
          this.getFields();
          this._swal.show({
            icon: 'success',
            title: (state === 'Inactivo' ? '¡Campo inhabilitado!' : '¡Campo activado!'),
            text: (state == 'Inactivo' ? 'El campo ha sido anulado.' : 'El campo ha sido activado.'),
            showCancel: false,
            timer: 1000
          });
        })
      }
    });
  }

}
