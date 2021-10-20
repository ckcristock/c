import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';

@Component({
  selector: 'app-configuracion-empresa',
  templateUrl: './configuracion-empresa.component.html',
  styleUrls: ['./configuracion-empresa.component.scss']
})
export class ConfiguracionEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  constructor( 
                private _configuracionEmpresaService: ConfiguracionEmpresaService,
                private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.createForm();
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
    .subscribe( (res:any) =>{
      this.modal.hide();
      this.form.reset();
      Swal.fire({
        icon: 'success',
        title: 'Configuración cambiada',
        text: 'La Configuración de pago ha sido cambiada con éxito'
      });
    })
  }

}
