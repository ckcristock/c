import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { DisabilityLeavesService } from './disability-leaves.service';
import { PayrollFactorService } from './payroll-factor.service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {
  openModal = new EventEmitter<any>()
  form: FormGroup

  people: any[] = []
  loading = false
  paylads: any[] = []

  constructor(
    private _payroll: PayrollFactorService,
    private fb: FormBuilder
  ) {

  }
  ngOnInit() {
    this.createFrom()
    this.cargarNovedades()
  }

  cargarNovedades() {
    this.loading = true;
    this._payroll.getPayrollFactorPeople(this.form.value)
      .subscribe((r: any) => {
        this.loading = false;
        this.people = r.data
        this.paylads = this.people.reduce(this.reducePayloads,[])
      })
  }

  createFrom() {
    let dateStart = moment().startOf("month").format(moment.HTML5_FMT.DATE)
    let dateEnd = moment().endOf("month").format(moment.HTML5_FMT.DATE)
    this.form = this.fb.group({
      date_start: [dateStart, Validators.required],
      date_end: [dateEnd, Validators.required],
    })
  }

  editarNovedad(fact){
    console.log(fact)
    this.openModal.next({data:fact})
  }

  get totalVacaciones(){
    return this.paylads.filter(r => r.disability_type == 'Vacaciones').length 
  }
  get totalIncapacidades(){
    return this.paylads.filter(r => r.disability_type == 'Incapacidad').length 
  }
  get totalLicencias(){
    return this.paylads.filter(r => r.disability_type == 'Licencia').length 
  }
  get totalPermisos(){
    return this.paylads.filter(r => r.disability_type == 'Permisos').length 
  }
  get totalAbandonos(){
    return this.paylads.filter(r => r.disability_type == 'Abandono').length 
  }
  get totalSuspensiones(){
    return this.paylads.filter(r => r.disability_type == 'Suspensión').length 
  }

  reducePayloads  =  (acc, el)=>[...acc, ...el.payroll_factors ]
}
