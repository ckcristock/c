import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';

@Component({
  selector: 'app-configuracion-empresa',
  templateUrl: './configuracion-empresa.component.html',
  styleUrls: ['./configuracion-empresa.component.scss']
})
export class ConfiguracionEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      calculate_work_disability: [''],
      pay_deductions: [''],
      recurring_payment: [''],
      payment_transport_subsidy: [''],
      affects_transportation_subsidy: [''],
      pay_vacations: [''],
    });
  }

  changePaymentConfiguration() {
    this._configuracionEmpresaService.changePaymentConfiguration(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll(); 
        this.form.reset();
        Swal.fire({
          icon: 'success',
          title: 'Configuración cambiada',
          text: 'La Configuración de pago ha sido cambiada con éxito'
        });
      })
  }

}
