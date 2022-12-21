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
import { QuotationService } from '../cotizacion/quotation.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('add') add: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  today = new Date().toISOString().slice(0, 10);
  form: FormGroup;
  formFiltersBusiness: FormGroup;
  formFiltersBudgets: FormGroup;
  matPanel: boolean = false;
  quotationSelected: any[] = [];
  budgetsSelected: any[] = [];
  budgets: any[] = [];
  business: any[] = [];
  cities: any[] = [];
  quotations: any[] = []
  contacts: any[];
  companies: any[];
  countries: any[];
  negocios_tercera_etapa: Negocio[];
  negocios_segunda_etapa: Negocio[];
  negocios_primera_etapa: Negocio[];
  selectedContact: any;
  selectedCountry: any;
  companySelected: any;
  orderObj: any
  city: any;
  loading: boolean;
  active = 1;
  total = {
    first: 0,
    second: 0,
    third: 0,
  };
  paginationBusiness: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  paginationBudgets: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  paginationQuotations: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtersQuotations = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }

  constructor(
    private _reactiveValid: ValidatorsService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private location: Location,
    private _quotation: QuotationService,
    private _modal: ModalService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.orderObj = { ...params.keys, ...params };
        if (params.keys.length == 0) {
          this.active = 1
          this.changeUrl('?active=1')
        } else if (this.orderObj.params.active == 2) {
          this.active = 2
        } else if (this.orderObj.params.active == 1) {
          this.active = 1
        }
      }
      );
    this.createForm();
    this.createFormFiltersBusiness();
    this.createFormFiltersBudgets();
    this.getCompanies();
    this.getNegocios();
    this.getLists();
    this.calcularTotal();
    this.getCountries();
    //this.getQuotations();
  }


  createFormFiltersBudgets() {
    this.formFiltersBudgets = this.fb.group({
      item: '',
      date: '',
      customer: '',
      destiny: '',
      line: '',
      person: '',
    })
    this.formFiltersBudgets.valueChanges
      .pipe(debounceTime(500)).subscribe(r => this.getBudgets())
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  createFormFiltersBusiness() {
    this.formFiltersBusiness = this.fb.group({
      code: '',
      name: '',
      company_name: '',
      date: '',
      status: '',
    });
    this.formFiltersBusiness.valueChanges.pipe(debounceTime(500)).subscribe(r => {
      this.getNegocios()
    })
  }

  getQuotations(page = 1) {
    this.quotationSelected = []
    this.paginationQuotations.page = page;
    let params = {
      ...this.paginationQuotations,
      ...this.filtersQuotations,
      third_party_id: this.form.value.third_party_id
    }
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.paginationQuotations.collectionSize = res.data.total;
    })
  }

  changeUrl(url) {
    this.location.replaceState('/crm/negocios', url);
  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'xl')
  }

  getNegocios(page = 1) {
    this.paginationBusiness.page = page;
    this.loading = true;
    let params = {
      ...this.paginationBusiness, ...this.formFiltersBusiness.value
    }
    this._negocios.getBusinesses(params).subscribe((resp: any) => {
      this.loading = false;
      this.business = resp.data.data;
      this.paginationBusiness.collectionSize = resp.data.total;
      this.getLists()
    });
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._reactiveValid.required],
      description: ['', Validators.required],
      third_party_id: [null, this._reactiveValid.required],
      third_party_person_id: [null, this._reactiveValid.required],
      country_id: [null, Validators.required],
      city_id: [null, Validators.required],
      date: ['', Validators.required],
      //cotizacion_id: [''],
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
    setTimeout(() => {
      this.negocios_segunda_etapa = this.business.filter(
        (t) => t.status === 'second'
      );
      this.negocios_tercera_etapa = this.business.filter(
        (t) => t.status === 'third'
      );
      this.negocios_primera_etapa = this.business.filter(
        (t) => t.status === 'first'
      );
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
    this._negocios.getThirds().subscribe(
      (resp: any) => {
        this.companies = resp.data;
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

  filterDepartments(id) {
    this.cities = []
    this.countries.forEach(country => {
      if (country.id == id) {
        country.departments.forEach(department => {
          department.municipalities.forEach(municipality => {
            this.cities.push(municipality)
          });
        });
      }
    });
    this.cities.sort((a, b) =>
      ('' + a.text).localeCompare(b.text)
    )
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
    this._negocios.getThirdPartyPersonForThird(this.form.value.third_party_id).subscribe((resp: any) => {
      this.contacts = resp.data;
    });
  }

  getBudgets(page = 1) {
    this.budgetsSelected = []
    this.paginationBudgets.page = page;
    let params = {
      ...this.paginationBudgets,
      ...this.formFiltersBudgets.value,
      third_party_id: this.form.value.third_party_id
    }
    this._negocios.getBudgets(params).subscribe((resp: any) => {
      this.budgets = resp.data.data;
      this.paginationBudgets.collectionSize = resp.data.total;
    });
  }

  guardarPresupuesto(event, item) {
    if (event.checked) {
      // Add the new value in the selected options
      this.budgetsSelected.push((item));
    } else {
      ;
      // removes the unselected option
      this.budgetsSelected = this.budgetsSelected.filter((selected) => {
        return selected.id !== event.source.id
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
  guardarCotizacion(event, item) {
    if (event.checked) {
      this.quotationSelected.push(item);
    } else {
      this.quotationSelected = this.quotationSelected.filter((selected) => {
        return selected.id !== event.source.id
      });
    }
  }

  saveBusiness() {
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar la cotización',
        icon: 'question',
        showCancel: true,
      }).then((r) => {
        if (r.isConfirmed) {
          this.form.addControl('budgets', this.fb.control(this.budgetsSelected));
          this.form.addControl('quotations', this.fb.control(this.quotationSelected));
          this.budgetsSelected.reduce((a, b) => {
            return this.form.addControl('budget_value', this.fb.control(a + b.total_cop))
          }, 0)
          this.quotationSelected.reduce((a, b) => {
            return this.form.addControl('quotation_value', this.fb.control(a + b.total_cop))
          }, 0)
          this._negocios.saveNeg(this.form.value).subscribe(r => {
            this._modal.close()
            this.form.reset();
            this.budgetsSelected = [];
            this.quotationSelected = [];
            this.budgets = [];
            this.quotations = [];
            this.getNegocios();
          });
          this.addEventToHistory('Negocio Creado');
        }
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Completa todos los campos requeridos para poder continuar',
        showCancel: false
      })
    }

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
