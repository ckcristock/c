import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  @ViewChild('modal') modal: any;

  negocios: any[] = [];

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
  loading: boolean = true;
  loading2: boolean
  cities: any;
  city: any;
  orderObj: any

  constructor(
    private _reactiveValid: ValidatorsService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.orderObj = { ...params.keys, ...params };
        if (params.keys.length == 0){
          this.active = 1
          this.changeUrl('?active=1')
        } else if (this.orderObj.params.active == 2){
          this.active = 2
        } else if (this.orderObj.params.active == 1){
          this.active = 1
        }
      }
      );
    this.createForm();
    this.getCompanies();
    this.getNegocios();
    this.getLists();
    this.calcularTotal();
    this.getCountries();
  }

  changeUrl(url) {
    this.location.replaceState('/crm/negocios', url);
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset()
    
  }

  getNegocios() {
    this.loading = true;
    this.loading2 = true; 
    this._negocios.getBusinesses().subscribe((resp: any) => {
      this.loading = false;
      this.negocios = resp.data;
      this.getLists()
    });
    // this._negocios.getNeg().subscribe((resp: any) => {
    //   this.negocios = resp;
    // });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._reactiveValid.required],
      description: ['', Validators.required],
      third_party_id: ['', this._reactiveValid.required],
      third_party_person_id: ['', this._reactiveValid.required],
      country_id: ['', Validators.required],
      city_id: ['', Validators.required],
      date: ['', Validators.required],
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
      this._negocios.changeState({ status: targetStatus }, event.data.id).subscribe();
    }
  }

  private getLists() {
    this.loading2 = true
    setTimeout(() => {
      this.negocios_segunda_etapa = this.negocios.filter(
        (t) => t.status === 'second'
      );
      this.negocios_tercera_etapa = this.negocios.filter(
        (t) => t.status === 'third'
      );
      this.negocios_primera_etapa = this.negocios.filter(
        (t) => t.status === 'first'
      );
      this.loading2 = false
    }, 1000);

  }

  calcularTotal() {
    this.total = {
      first: 0,
      second: 0,
      third: 0,
    };
    setTimeout(() => {
      this.negocios_tercera_etapa?.forEach((neg: Negocio) => {
        neg.business_budget.forEach(el => {
          this.total.third += el.budget.total_cop;
        });
      });
      this.negocios_primera_etapa?.forEach((neg: Negocio) => {
        neg.business_budget.forEach(el => {
          this.total.first += el.budget.total_cop;
        });
      });
      this.negocios_segunda_etapa?.forEach((neg: Negocio) => {
        neg.business_budget.forEach(el => {
          this.total.second += el.budget.total_cop;
        });
      });
    }, 1000);
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
      () => { },
      () => {
        // console.log(this.companies);
      }
    );
  }

  getCountries() {
    this._negocios.getCountries().subscribe((data: any) => {
      this.countries = data.data;
    });
  }

  getCities() {
    this._negocios.getCities(this.form.value.country_id).subscribe((data: any) => {
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

  getContacts() {
    this._negocios.getThirdPartyPerson(this.form.value.third_party_id).subscribe((resp: any) => {
      this.contacts = resp.data.data;
    });
  }

  getBudgets() {
    this._negocios.getBudgets(this.form.value.third_party_id).subscribe((resp: any) => {
      this.budgets = resp.data.data;
    });
  }

  guardarPresupuesto(event, item) {
    if (event.target.checked) {
      // Add the new value in the selected options
      this.budgetsSelected.push((item));
    } else {
      ;
      // removes the unselected option
      this.budgetsSelected = this.budgetsSelected.filter((selected) => {
        selected.id !== event.target.id
      });
    }
    // if (this.budgetsSelected.includes(value)) {
    //   this.budgetsSelected = this.budgetsSelected.filter(
    //     (data) => data !== value
    //     );
    //     console.log(this.budgetsSelected);
    //   return;
    // }
    // this.budgetsSelected.push(value);
    // return;
  }

  createNeg() {
    this.form.addControl('budgets', this.fb.control(this.budgetsSelected));
    this.budgetsSelected.reduce((a, b) => {
      return this.form.addControl('budget_value', this.fb.control(a + b.total_cop))
    }, 0)
    this._negocios.saveNeg(this.form.value).subscribe(r => {
      this.modalService.dismissAll();
      this.budgetsSelected = [];
      this.budgets = [];
      this.getNegocios();
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
