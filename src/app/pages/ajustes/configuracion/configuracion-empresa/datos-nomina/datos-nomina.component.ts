import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-nomina',
  templateUrl: './datos-nomina.component.html',
  styleUrls: ['./datos-nomina.component.scss']
})
export class DatosNominaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  nomina:any = [];
  constructor( 
                private _configuracionEmpresaService: ConfiguracionEmpresaService,
                private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getNominaData();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.nomina.id],
      max_extras_hours: [''],
      max_holidays_legal: [''],
      max_late_arrival: [''],
      base_salary: [''],
      transportation_assistance: [''],
      night_start_time: [''],
      night_end_time: ['']
    });
  }

  getNominaData() {
    this._configuracionEmpresaService.getCompanyData()
    .subscribe( (res:any) => {
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
    .subscribe( (res:any) =>{
      this.modal.hide();
      this.getNominaData();
      Swal.fire({
        icon: 'success',
        title: 'Actualizado Correctamente'
      });
    })
  }

}
