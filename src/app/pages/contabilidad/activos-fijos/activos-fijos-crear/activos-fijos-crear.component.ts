import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ActivosFijosService } from '../activos-fijos.service';
type Person = {value: number, text: string};

@Component({
  selector: 'app-activos-fijos-crear',
  templateUrl: './activos-fijos-crear.component.html',
  styleUrls: ['./activos-fijos-crear.component.scss']
})
export class ActivosFijosCrearComponent implements OnInit {
  form: FormGroup;
  date:Date = new Date();
  people:any[] = [];
  tipoActivos:any[] = [];
  person_selected:any;
  total_credits:number = 0;
  total_debit:number = 0;
  diference:number = 0;
  constructor( 
                private location: Location,
                private fb: FormBuilder,
                private _activosFijos: ActivosFijosService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPeople();
    this.valuesChange();
    this.getTiposActivos();
  }

  regresar() {
    this.location.back();
  }

  createForm() {
    this.form = this.fb.group({
      type: [''],
      date: [''],
      user_id: [''],
      fixed_asset_type_id: [''],
      niif_cost: [''],
      pcga_cost: [''],
      nit: [''],
      iva: [''],
      base: [''],
      source: [''],
      niif_iva: [''],
      niif_base: [''],
      center_cost_id: [''],
      name: [''],
      amount: [''],
      document: [''],
      reference: [''],
      code: [''],
      fixed_asset_code: [''],
      concept: [''],
      depreciation_type: [''],
      source_rete_account: [''],
      source_ica_account: [''],
      source_rete_cost: [''],
      source_ica_cost: [''],
      ica_rete_cost: [''],
      niif_source_rete_cost: [''],
      niif_ica_rete_cost: [''],
      rete_ica_account_id: [''],
      source_rete_account_id: [''],
      valueCtaxPay: [''],
      total_credits: [0],
      total_debit: [0],
      diference: [0],
      anticipo: this.fb.array([])
    });
    this.createNewAdvance();
  }
    /***************** TypesHeads Start *******************/
    formatterPeople = (state: Person) => state.text;
    searchPeople: OperatorFunction<string, readonly {value, text}[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 3),
    map(term => this.people.filter(state => new RegExp(term, 'mi').test(state.text)).slice(0, 10))
  )
    /***************** TypesHeads End *******************/

  getPersonId(){
    let value = this.person_selected;
    if (typeof value == 'object') {
        this.form.patchValue({
          user_id: value.value
        })  
    }
  }

  getTiposActivos() {
    this._activosFijos.getFixedAssetType()
    .subscribe( (res:any) =>{
      this.tipoActivos = res.data
    }) 
  }

  getPeople(){
    this._activosFijos.getPeople()
    .subscribe( (res:any) =>{
      this.people = res.data;
    })
  }
  
  getAnticipoControl(){
    let group = this.fb.group({
      advance_account: [''],
      nit: [''],
      document: [''],
      concept: [''],
      value: [0]
    });
    return group;
  }

  

  createNewAdvance(){
    let advance = this.anticipoList;
    advance.push(this.getAnticipoControl());
  }

  get anticipoList(){
    return this.form.get('anticipo') as FormArray;
  }

  valuesChange() {
    this.form.get('name').valueChanges.subscribe(value => {
      let document = this.form.get('document').value;
      this.form.patchValue({
        concept: document + ' ' + value 
      })
    });
    this.form.get('document').valueChanges.subscribe(value => {
      let name = this.form.get('name').value;
      this.form.patchValue({
        concept: value + ' ' + name
      })
    });
    this.form.get('source_rete_cost').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('source_ica_cost').valueChanges.subscribe(r => {
      this.sumarTotal();  
    });
    this.form.get('valueCtaxPay').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('niif_base').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('niif_iva').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('base').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('iva').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
    this.form.get('diference').valueChanges.subscribe(r => {
      this.sumarTotal();
    });
  }

  sumarTotal(){
    setTimeout(() => {
      let forma = this.form.value;
      let pcga_cost = forma.base + forma.iva;
      let niif_cost = forma.niif_base + forma.niif_iva;
      this.form.patchValue({
        pcga_cost,
        niif_cost
      });
      this.total_credits = forma.source_rete_cost + forma.source_ica_cost + forma.valueCtaxPay;
      this.total_debit   = forma.base + forma.iva;
      this.diference     = this.total_debit - this.total_credits;
    }, 300);
  }

}
