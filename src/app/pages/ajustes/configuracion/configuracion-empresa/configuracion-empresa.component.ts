import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { data, map, param } from 'jquery';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';
import { DatosBasicosEmpresaComponent } from './datos-basicos-empresa/datos-basicos-empresa.component';
import { DatosNominaComponent } from './datos-nomina/datos-nomina.component';
import { DatosPagoComponent } from './datos-pago/datos-pago.component';
import { DatosPilaComponent } from './datos-pila/datos-pila.component';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from '../../informacion-base/services/swal.service';
@Component({
  selector: 'app-configuracion-empresa',
  templateUrl: './configuracion-empresa.component.html',
  styleUrls: ['./configuracion-empresa.component.scss'],
})
export class ConfiguracionEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(DatosBasicosEmpresaComponent) datBasic: DatosBasicosEmpresaComponent;
  @ViewChild(DatosNominaComponent) datNomina: DatosNominaComponent;
  @ViewChild(DatosPagoComponent) datPago: DatosPagoComponent;
  @ViewChild(DatosPilaComponent) datPila: DatosPilaComponent;
  form: FormGroup;
  dataCompany: any;
  companies: Array<Object>;
  showBasicData: boolean = false;
  file: any;
  fileString: any;
  company_name: string = '';
  active: number = 1;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    public rutaActiva: ActivatedRoute,
    private _modal: ModalService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    let value = this.rutaActiva.snapshot.params.value
    value == 'informacion'
      ? this.active = 1
      : value == 'estructura'
        ? this.active = 2
        : value == 'cuentas-bancarias'
          ? this.active = 3
          : value == 'categorias'
            ? this.active = 4
            : value == 'sedes'
              ? this.active = 5
              : this.active = 1

    this.createForm();
    this.getDataCompany()
  }


  page_heading: boolean;
  getDataCompany() {
    this._configuracionEmpresaService
      .getCompanyData()
      .subscribe((res: any) => {
        res.data.page_heading ? this.page_heading = true : false
        this.company_name = res.data.name
        this.datBasic.company = res.data;
        this.datNomina.nomina = res.data;
        this.datPago.payments = res.data;
        this.datPago.bank = res?.data?.bank?.name;
        this.datPila.pilas = res.data;
        this.datPila.arl = res?.data?.arl?.name;
        this.datBasic.getBasicData();
        this.datPila.getPilaData();
        this.datNomina.getNominaData();
        this.datPago.getPaymentData();
      });
  }

  openModal(modal) {
    this._modal.open(modal);
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
    this._configuracionEmpresaService
      .changePaymentConfiguration(this.form.value)
      .subscribe((res: any) => {
        this.modal.hide();
        this.form.reset();
        Swal.fire({
          icon: 'success',
          title: 'Configuración cambiada',
          text: 'La Configuración de pago ha sido cambiada con éxito',
        });
      });
  }
  string_input = 'Cargar hoja membrete'
  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64
        this._configuracionEmpresaService.saveCompanyData({
          id: 1,
          page_heading: this.file
        }).subscribe((res: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Hoja cargada con éxito',
            showCancel: false,
            text: '',
            timer: 1000
          })
          this.page_heading = true;
        })
      });
    }
  }
}
