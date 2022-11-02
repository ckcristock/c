import { Component, DoCheck, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';
import { configEmpresa } from '../configuracion';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../../informacion-base/services/swal.service';

@Component({
  selector: 'app-datos-pila',
  templateUrl: './datos-pila.component.html',
  styleUrls: ['./datos-pila.component.scss']
})
export class DatosPilaComponent implements OnInit, DoCheck {
  @Output() update = new EventEmitter
  form: FormGroup;
  arls: any = [];
  pilas: any = [];
  pay_operators = configEmpresa.pay_operator;
  loading: boolean = true;
  arl: any;
  show: boolean = false;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
  ) { }
  ngDoCheck(): void {
    if (this.pilas.id) {
      this.loading = false
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.getPilaData();
    this.getArl();
  }

  updateData() {
    this.update.emit()
  }

  openModal(modal) {
    this._modal.open(modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pilas.id],
      paid_operator: ['', Validators.required],
      law_1429: [''],
      law_590: [''],
      law_1607: [''],
      arl_id: ['', Validators.required]
    });
  }

  getArl() {
    this._configuracionEmpresaService.getArl()
      .subscribe((res: any) => {
        this.arls = res.data;
      })
  }

  getPilaData() {
    if (this.pilas.id) this.show = true;
    // this._configuracionEmpresaService.getCompanyData()
    // .subscribe((res: any) => {
    // this.pilas = res.data;
    // this.arl = res.data.arl.name;
    this.form.patchValue({
      id: this.pilas.id,
      paid_operator: this.pilas.paid_operator,
      law_1429: this.pilas.law_1429,
      law_590: this.pilas.law_590,
      law_1607: this.pilas.law_1607,
      arl_id: this.pilas.arl_id
      // });
    })
  }

  savePilaData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this._modal.close();
        this.updateData();
        this.getPilaData();
        this._swal.show({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Datos actualizados correctamente',
          timer: 1000,
          showCancel: false
        })
      })
  }

}
