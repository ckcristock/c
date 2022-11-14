import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';

@Component({
  selector: 'app-configuracion-empresa',
  templateUrl: './configuracion-empresa.component.html',
  styleUrls: ['./configuracion-empresa.component.scss']
})
export class ConfiguracionEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('datos') datosEmpresa;
  form: FormGroup;

  calculate_work_disability = '';
  pay_deductions = '';
  recurring_payment = '';
  payment_transport_subsidy = '';
  affects_transportation_subsidy = '';
  pay_vacations = '';


  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.createForm();
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }

  openModal() {
    this.modal.show();
  }

  getData(){
    this._configuracionEmpresaService.getPaymentConfiguration()
    .subscribe((res:any)=>{
      this.affects_transportation_subsidy = res.affects_transportation_subsidy;
      this.calculate_work_disability = res.calculate_work_disability;
      this.pay_deductions = res.pay_deductions;
      this.pay_vacations = res.pay_vacations;
      this.payment_transport_subsidy = res.payment_transport_subsidy;
      this.recurring_payment = res.recurring_payment;
    });
  }

  createForm() {
    this.form = this.fb.group({
      calculate_work_disability: [this.calculate_work_disability],
      pay_deductions: ['', this._validators.required],
      recurring_payment: ['', this._validators.required],
      payment_transport_subsidy: ['', this._validators.required],
      affects_transportation_subsidy: ['', this._validators.required],
      pay_vacations: ['', this._validators.required],
    });
  }

  changePaymentConfiguration() {
    console.log(this.datosEmpresa);
    this.form.value.company_id = 1;
    this._configuracionEmpresaService.changePaymentConfiguration(this.form.value)
      .subscribe((res: any) => {
        console.log(this.form.value);
        this.modalService.dismissAll();
        this.form.reset();
        console.log(res)
        this._swal.show({
          icon: 'success',
          title: '¡Correcto!',
          text: 'La configuración de pago ha sido cambiada con éxito.',
          timer: 1000,
          showCancel: false
        })

      },
        err => {
          this._swal.show({
            title: 'ERROR',
            text: 'Intenta nuevamente.',
            icon: 'error',
            showCancel: false,
          })
        })
  }

}
