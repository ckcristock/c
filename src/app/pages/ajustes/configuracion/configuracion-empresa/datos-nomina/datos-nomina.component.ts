import { Component, DoCheck, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-nomina',
  templateUrl: './datos-nomina.component.html',
  styleUrls: ['./datos-nomina.component.scss']
})
export class DatosNominaComponent implements OnInit, DoCheck {
  @Output() update = new EventEmitter
  form: FormGroup;
  nomina: any = [];
  differ: any;
  loading: boolean = true;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private _modal: ModalService,
    private _swal: SwalService,
  ) { 
  }
  ngDoCheck(): void {
    if (this.nomina.id) {
      this.loading = false
    }
  }

  updateData() {
    this.update.emit()
  }

  ngOnInit(): void {
    this.createForm();
    this.getNominaData();
  }

  openModal(modal) {
    this._modal.open(modal);
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.nomina.id],
      max_extras_hours: ['', Validators.required],
      max_holidays_legal: ['', Validators.required],
      max_late_arrival: ['', Validators.required],
      base_salary: ['', Validators.required],
      transportation_assistance: ['', Validators.required],
      night_start_time: ['', Validators.required],
      night_end_time: ['', Validators.required]
    });
  }

  getNominaData() {
    this.form.patchValue({
      id: this.nomina.id,
      max_extras_hours: this.nomina.max_extras_hours,
      max_holidays_legal: this.nomina.max_holidays_legal,
      max_late_arrival: this.nomina.max_late_arrival,
      base_salary: this.nomina.base_salary,
      transportation_assistance: this.nomina.transportation_assistance,
      night_start_time: this.nomina.night_start_time,
      night_end_time: this.nomina.night_end_time
    })
  }

  saveNominaData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this._modal.close();
        this.updateData();
        this.getNominaData();
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
