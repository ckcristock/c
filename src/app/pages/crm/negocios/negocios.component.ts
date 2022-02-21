import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { ValidatorsService } from '../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { Negocio } from './negocio.interface';
import { NegociosService } from './negocios.service';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  @ViewChild('modal') modal: any;

  negocios: any[];

  negocios_tercera_etapa: Negocio[];
  negocios_segunda_etapa: Negocio[];
  negocios_primera_etapa: Negocio[];
  form: FormGroup;

  active = 1;
  contacts: any[];
  selectedContact: any;

  countries: any[];
  selectedCountry: any;

  budgets: any[] = [];
  budgetsSelected: any[] = [];

  total = {
    first: 0,
    second: 0,
    third: 0,
  };

  today = new Date().toISOString().slice(0, 10);
  companies: any[];
  companySelected: any;

  cities: any;
  city: any;

  constructor(
    private _reactiveValid: ValidatorsService,
    private fb: FormBuilder,
    private _negocios: NegociosService
  ) {}

  ngOnInit(): void {
    this.getCompanies();
    this.getNegocios();
    this.getLists();
    this.calcularTotal();
    this.createForm();
    this.getCountries();
  }

  getNegocios() {
    this._negocios.getNeg().subscribe((resp: any) => {
      this.negocios = resp;
    });
  }

  selectContact() {
    this.form.patchValue({
      contact_id: this.selectedContact,
    });
  }

  createForm() {
    this.form = this.fb.group({
      request_name: ['', this._reactiveValid.required],
      request_description: ['', Validators.required],
      company_id: ['', this._reactiveValid.required],
      contact_id: ['', this._reactiveValid.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      date: ['', Validators.required],
      presupuesto_id: [''],
      cotizacion_id: [''],
    });
  }

  /**
   * Detecta cuando se suelta un elemento y se elimina de la lista actual
   */
  onDragged(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
    this.calcularTotal();
  }

  /**
   * Detecta cuando se suelta un Elemento, y se agrega a la nueva lista actual
   */
  onDrop(event: any, filteredList?: any[], targetStatus?: string) {
    event.data.status = targetStatus ? targetStatus : '';
    if (filteredList && event.dropEffect === 'move') {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = filteredList.length;
      }
      filteredList.splice(index, 0, event.data);
    }
  }

  private getLists() {
    this.negocios_segunda_etapa = this.negocios.filter(
      (t) => t.status === 'second'
    );
    this.negocios_tercera_etapa = this.negocios.filter(
      (t) => t.status === 'third'
    );
    this.negocios_primera_etapa = this.negocios.filter(
      (t) => t.status === 'first'
    );
  }

  calcularTotal() {
    this.total = {
      first: 0,
      second: 0,
      third: 0,
    };
    this.negocios_tercera_etapa.forEach((neg: Negocio) => {
      this.total.third += neg.presupuesto;
    });
    this.negocios_primera_etapa.forEach((neg: Negocio) => {
      this.total.first += neg.presupuesto;
    });
    this.negocios_segunda_etapa.forEach((neg: Negocio) => {
      this.total.second += neg.presupuesto;
    });
  }

  inputFormatBandListValue(value: any) {
    if (value.text) return value.text;
    return value;
  }

  getCompanies() {
    this._negocios.getCompanies().subscribe(
      (resp: any) => {
        this.companies = resp.data.data;
      },
      () => {},
      () => {
        console.log(this.companies);
      }
    );
  }

  getCountries() {
    this._negocios.getCountries().subscribe((data: any) => {
      this.countries = data.data;
    });
  }

  getCities() {
    this.city = null;
    let params = {
      country: this.form.value.country,
    };
    this._negocios.getCities(params).subscribe((data: any) => {
      this.cities = data.data;
    });
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

  formatter = (state: any) => state.text;
  search: OperatorFunction<string, readonly { value; text }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 1),
      map((term) =>
        this.contacts
          .filter((state) => new RegExp(term, 'mi').test(state.text))
          .slice(0, 10)
      )
    );

  getContacts(event: any) {
    this.selectedContact = null;
    let params = {
      third: event?.first_name,
    };

    this._negocios.getThirdPartyPerson(params).subscribe((resp: any) => {
      this.contacts = resp.data.data;
    });
  }

  getBudgets(event: any) {
    console.log(event);

    let params = {
      customer_id: event?.id,
    };
    this._negocios.getBudgets(params).subscribe((resp: any) => {
      this.budgets = resp.data.data;
      console.log(this.budgets);
    });
  }

  guardarPresupuesto(value) {
    if (this.budgetsSelected.includes(value)) {
      this.budgetsSelected = this.budgetsSelected.filter(
        (data) => data !== value
      );
      console.log(this.budgetsSelected);

      return;
    }
    console.log(this.budgetsSelected);
    this.budgetsSelected.push(value);
    return;
  }

  createNeg() {
    // TODO Backend & service
    console.log('Guardado en local');
    this.contacts = null;
    console.log(this.form.value);

    this._negocios.saveNeg(this.form.value).subscribe((data) => {
      console.log(data);
    });
    this.addEventToHistory('Negocio Creado');
  }

  addEventToHistory(desc) {
    this._negocios.addEventToHistroy(desc).subscribe((data) => {
      console.log(data);
    });
  }
  get process_description_valid() {
    return (
      this.form.get('request_description').invalid &&
      this.form.get('request_description').touched
    );
  }
}
