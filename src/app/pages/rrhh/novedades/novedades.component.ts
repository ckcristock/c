import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { DisabilityLeavesService } from './disability-leaves.service';
import { PayrollFactorService } from './payroll-factor.service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {
  openModal = new EventEmitter<any>()
  people: any[] = []
  loading = false
  constructor(
    private _payroll: PayrollFactorService
  ) {

  }
  ngOnInit() {
  }

  cargarNovedades(form: NgForm) {
    this.loading = true;
    this._payroll.getPayrollFactorPeople(form.value).subscribe((r: any) => {
      this.loading = false;
      this.people = r.data
    })
  }
}
