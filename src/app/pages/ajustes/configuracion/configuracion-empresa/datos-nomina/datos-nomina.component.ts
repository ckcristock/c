import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-nomina',
  templateUrl: './datos-nomina.component.html',
  styleUrls: ['./datos-nomina.component.scss']
})
export class DatosNominaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  nomina: any = [];
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getNominaData();
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

  createForm() {
    this.form = this.fb.group({
      id: [this.nomina.id],
      max_extras_hours: ['', this._validators.required],
      max_holidays_legal: ['', this._validators.required],
      max_late_arrival: ['', this._validators.required],
      base_salary: ['', this._validators.required],
      transportation_assistance: ['', this._validators.required],
      night_start_time: ['', this._validators.required],
      night_end_time: ['', this._validators.required]
    });
  }

  getNominaData() {
    this._configuracionEmpresaService.getCompanyData()
      .subscribe((res: any) => {
        this.nomina = res.data;
        this.form.patchValue({
          id: this.nomina.id,
          max_extras_hours: this.nomina.max_extras_hours,
          max_holidays_legal: this.nomina.max_holidays_legal,
          max_late_arrival: this.nomina.max_late_arrival,
          base_salary: this.nomina.base_salary,
          transportation_assistance: this.nomina.transportation_assistance,
          night_start_time: this.nomina.night_start_time,
          night_end_time: this.nomina.night_end_time
        });
      })
  }

  saveNominaData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll(); 
        this.getNominaData();
        this._swal.show({
          icon: 'success',
          title: 'Actualizado correctamente',
          text: '',
          timer: 1000,
          showCancel: false
        })        
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Intenta nuevamente',
          icon: 'error',
          showCancel: false,
        })
      }
      )
  }

}
