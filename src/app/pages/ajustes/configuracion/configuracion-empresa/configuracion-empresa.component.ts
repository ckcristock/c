import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { data, map, param } from 'jquery';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { ConfiguracionEmpresaService } from './configuracion-empresa.service';
import { DatosBasicosEmpresaComponent } from './datos-basicos-empresa/datos-basicos-empresa.component';
import { DatosNominaComponent } from './datos-nomina/datos-nomina.component';
import { DatosPagoComponent } from './datos-pago/datos-pago.component';
import { DatosPilaComponent } from './datos-pila/datos-pila.component';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from '../../informacion-base/services/swal.service';
import { Texteditor2Service } from '../../informacion-base/services/texteditor2.service';
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
  event2: Event;

  form: FormGroup;
  dataCompany: any;
  companies: Array<Object>;
  showBasicData: boolean = false;
  file: any;
  fileString: any;
  company_name: string = '';
  active: number = 1;
  @Input('datos') datosEmpresa;
  calculate_work_disability = '';
  pay_deductions = '';
  recurring_payment = '';
  payment_transport_subsidy = '';
  affects_transportation_subsidy = '';
  pay_vacations = '';
  commercial_terms_ = new FormControl();
  technical_requirements = new FormControl();
  legal_requirements = new FormControl();


  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    public rutaActiva: ActivatedRoute,
    private _modal: ModalService,
    private _texteditor: Texteditor2Service,
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
    this.getDataCompany();
    this.getData();
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
        this.commercial_terms_.setValue(res.data.commercial_terms)
        this.technical_requirements.setValue(res.data.technical_requirements)
        this.legal_requirements.setValue(res.data.legal_requirements)
        this.datBasic.getBasicData();
        this.datPila.getPilaData();
        this.datNomina.getNominaData();
        this.datPago.getPaymentData();
      });
  }

  openModal(modal, size) {
    this._modal.open(modal, size);
    this.createForm();
  }

  getData() {
    this._configuracionEmpresaService.getPaymentConfiguration()
      .subscribe((res: any) => {
        this.affects_transportation_subsidy = res.affects_transportation_subsidy;
        this.calculate_work_disability = res.calculate_work_disability;
        this.pay_deductions = res.pay_deductions;
        this.pay_vacations = res.pay_vacations;
        this.payment_transport_subsidy = res.payment_transport_subsidy;
        this.recurring_payment = res.recurring_payment;
      });
  }

  saveCommercialTerms() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar las condiciones comernciales',
        icon: 'question',
        showCancel: true,
      })
      .then((r) => {
        if (r.isConfirmed) {
          let data = {
            commercial_terms: this.commercial_terms_.value,
            technical_requirements: this.technical_requirements.value,
            legal_requirements: this.legal_requirements.value
          }
          this._configuracionEmpresaService.saveCommercialTerms(data, 1).subscribe((res: any) => {
            this._swal.show({
              title: res.data,
              text: '',
              icon: 'success',
              showCancel: false,
              timer: 1000
            })
            this._modal.close();
          })
        }
      });

  }

  createForm() {
    this.form = this.fb.group({
      calculate_work_disability: [this.calculate_work_disability],
      pay_deductions: [this.pay_deductions],
      recurring_payment: [this.recurring_payment],
      payment_transport_subsidy: [this.payment_transport_subsidy],
      affects_transportation_subsidy: [this.affects_transportation_subsidy],
      pay_vacations: [this.pay_vacations],
    });
  }

  changePaymentConfiguration() {
    console.log(this.datosEmpresa);
    this.form.value.company_id = 1;
    this._configuracionEmpresaService.changePaymentConfiguration(this.form.value)
      .subscribe((res: any) => {
        console.log(this.form.value);
        this._modal.close();
        this.form.reset();
        console.log(res)
        this._swal.show({
          icon: 'success',
          title: 'Configuración cambiada',
          text: 'La configuración de pago ha sido cambiada con éxito.',
          showCancel: false,
          timer: 1000
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
