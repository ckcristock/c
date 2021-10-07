import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NotasContablesService } from '../notas-contables.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
type centerCost = { value: number; text: string };
type third = { name: string };


@Component({
  selector: 'app-crear-nota-contable',
  templateUrl: './crear-nota-contable.component.html',
  styleUrls: ['./crear-nota-contable.component.scss']
})
export class CrearNotaContableComponent implements OnInit {
  date:Date = new Date();
  form: FormGroup;
  thirds:any;
  centerCosts:any;
  total_debit:any = 0;
  total_credit:number = 0;
  total_debit_niif:number = 0;
  total_credit_niif:number = 0;
  diference:number = 0;
  diference_niff:number = 0;
  constructor(
                private location: Location,
                private fb: FormBuilder,
                private _notasContables: NotasContablesService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.datosControl();
    this.getCenterCost();
    this.getThirdParties();
  }

  regresar(){
    this.location.back();
  }

  getCenterCost(){
    this._notasContables.getCenterCost().subscribe((r:any) => {
      this.centerCosts = r.data;
    })
  }

  formatter = (state: centerCost) => state.text;
  search: OperatorFunction<string, readonly { value; text }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.centerCosts
          .filter((state) => new RegExp(term, 'mi').test(state.text))
          .slice(0, 10)
      )
    );

    formatterthird = (state: third) => state.name;
    searchthird: OperatorFunction<string, readonly { name }[]> = (
    text$: Observable<string>
    ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.thirds
          .filter((state) => new RegExp(term, 'mi').test(state.name))
          .slice(0, 10)
      )
    );
  
  createForm() {
    this.form = this.fb.group({
      date: [''],
      beneficiary: [''],
      cost_center: [''],
      document: [''],
      concept: [''],
      drafts: [''],
      datos: this.fb.array([]),
      total_credit: [''],
      total_debit: ['']
    });
    this.createData();
  }

  datosControl(){
    let group = this.fb.group({
      account: [''],
      nit: [''],
      cost_center: [''],
      document: [''],
      concept: [''],
      base: [''],
      debit: [''],
      credit: [''],
      deb_niif: [''],
      cred_niif: ['']
    });
    group.get('debit').valueChanges.subscribe((value) => {
      group.patchValue({
        deb_niif: value,
      });
      this.getTotalDebit();
      this.diferencia();
    })
    group.get('credit').valueChanges.subscribe((value) => {
      group.patchValue({
        cred_niif: value
      });
      this.getTotalCredit();
      this.diferencia();
    })
    group.get('deb_niif').valueChanges.subscribe((value) => {
      this.getTotalDebit();
      this.diferencia();
    })
    group.get('cred_niif').valueChanges.subscribe((value) => {
      this.getTotalCredit();
      this.diferencia();
      this.total_credit_niif = value
    })
    return group;
  }
  
  sumar(){
    setTimeout(() => {
      let forma = this.form.value.datos;
      let total_credit = 
      parseFloat(forma.debit) +
      parseFloat(forma.credit);
      this.form.patchValue({
        total_credit
      });
    }, 300);
    
  }

  get datosList(){
    return this.form.get('datos') as FormArray;
  }

  getTotalDebit(){
      let totalDebit = this.datosList.value.reduce((a, b) => {
        return a + parseFloat(b.debit);
      }, 0);
      let totalDebitNiif = this.datosList.value.reduce( (a, b) => {
        return a + parseFloat(b.deb_niif)
      }, 0);
      this.total_debit = totalDebit;
      this.total_debit_niif = totalDebitNiif;
  }

  getTotalCredit(){
    let totalCredit = this.datosList.value.reduce( (a, b) => {
      return a + parseFloat(b.credit)
    }, 0);
    let totalCreditNiif = this.datosList.value.reduce( (a, b) => {
      return a + parseFloat(b.cred_niif)
    }, 0); 
    this.total_credit = totalCredit;
    this.total_credit_niif = totalCreditNiif;
  }

  getThirdParties(){
    this._notasContables.getThirdParties().subscribe((r:any) => {
      this.thirds = r.data;
    });
  }

  diferencia() {
    let diference = this.total_debit - this.total_credit;
    let diference_niif = this.total_debit_niif - this.total_credit_niif;
    this.diference = diference;
    this.diference_niff = diference_niif;
  }

  createData(){
    let data = this.datosList;
    data.push(this.datosControl());
  }

  deleteData(i){
    let data = this.datosList;
    data.removeAt(i);
    this.getTotalDebit();
  }

}
