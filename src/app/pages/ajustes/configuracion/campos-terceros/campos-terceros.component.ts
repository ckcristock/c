import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { camposTerceros } from './campos-terceros';
import { CamposTercerosService } from './campos-terceros.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-campos-terceros',
  templateUrl: './campos-terceros.component.html',
  styleUrls: ['./campos-terceros.component.scss']
})
export class CamposTercerosComponent implements OnInit {
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
  form: FormGroup;
  tipos = camposTerceros.tipos;
  fields: any[] = [];
  constructor(
    private fb: FormBuilder,
    private _field: CamposTercerosService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getFields();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.form.reset()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      length: ['']
    })
  }

  getFields() {
    this.loading = true;
    this._field.getFields().subscribe((r: any) => {
      this.loading = false;
      this.fields = r.data;
    })
  }

  save() {
    this._field.save(this.form.value).subscribe((r: any) => {
      console.log(r);
      this.modalService.dismissAll();
      this.form.reset();
      this.getFields();
    })
  }

  changeState(id, state) {
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (state == 'Inactivo' ? '¡El campo se Anulará!' : '¡El campo se Activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._field.changeState({ state: state }, id).subscribe((r: any) => {
          this.getFields();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactio',
            text: (state == 'Inactivo' ? 'El campo ha sido Anulado.' : 'El campo ha sido Activado.'),
            showCancel: false
          });
        })
      }
    });
  }

}
