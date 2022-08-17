import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ValorAlmuerzosService } from './valor-almuerzos.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-valor-almuerzos',
  templateUrl: './valor-almuerzos.component.html',
  styleUrls: ['./valor-almuerzos.component.scss']
})
export class ValorAlmuerzosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  values: any[] = [];
  value: any = {};
  loading: boolean = false;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }
  title: string = '';
  form: FormGroup;
  constructor(
    private _lunchValues: ValorAlmuerzosService, 
    private _swal: SwalService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    
  ) { }

  ngOnInit(): void {
    this.getValues();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.value.id],
      value: [0, Validators.required]
    })
  }

  openModal() {
    this.modal.show();
    
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }
  save() {
    this._lunchValues.save(this.form.value).subscribe((r: any) => {
      this.getValues();
      this.modalService.dismissAll(); 
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        timer: 1000,
        showCancel: false
      })
    },
    err => {
      this._swal.show({
        title: 'ERROR',
        text: 'Intenta nuevamente',
        icon: 'error',
        showCancel: false,
      })
    });
  }

  anularOActivar(value, state) {
    let data: any = { id: value.id, state }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (state === 'Inactivo' ? '¡El valor se inactivará!' : '¡El valor se activará!'),
      icon: 'question',
      showCancel: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        this._lunchValues.save(data)
          .subscribe(res => {
            this.getValues();
            this._swal.show({
              icon: 'success',
              title: (state === 'Inactivo' ? '¡Valor inhabilitado!' : '¡Valor activado!'),
              text: (state === 'Inactivo' ? 'El valor ha sido inhabilitado con éxito.' : 'El valor ha sido activado con éxito.'),
              timer: 1000,
              showCancel: false
            })
            
          })
      }
    })
  }

  getValue(value) {
    this.value = { ...value }
    this.form.patchValue({
      value: value.value,
      description: value.description,
      id: value.id
    })
  }

  getValues(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._lunchValues.getAll(this.pagination).subscribe((data: any) => {
      this.values = data.data.data;
      this.pagination.collectionSize = data.data.total;
      this.loading = false;
    })
  }

}
