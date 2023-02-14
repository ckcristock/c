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
import { ActivatedRoute, Router } from '@angular/router';
import { QuotationService } from '../cotizacion/quotation.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatAccordion, MatPaginatorIntl, PageEvent } from '@angular/material';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { HttpParams } from '@angular/common/http';

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
  negocios_quinta_etapa: Negocio[];
  negocios_cuarta_etapa: Negocio[];
  negocios_tercera_etapa: Negocio[];
  negocios_segunda_etapa: Negocio[];
  negocios_primera_etapa: Negocio[];
  selectedContact: any;
  selectedCountry: any;
  companySelected: any;
  filtrosActivos: boolean = false
  orderObj: any
  city: any;
  loading: boolean;
  active = 1;
  total = {
    first: 0,
    second: 0,
    third: 0,
    quarter: 0,
    fifth: 0
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

  permission: Permissions = {
    menu: 'Negocios',
    permissions: {
      show: true
    }
  };

  constructor(
    private _reactiveValid: ValidatorsService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private location: Location,
    private _quotation: QuotationService,
    private _modal: ModalService,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService,
    private _permission: PermissionService,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  async ngOnInit(): Promise<void> {
    if (this.permission.permissions.show) {
      this.createForm();
      this.createFormFiltersBusiness();
      this.createFormFiltersBudgets();
      this.getCompanies();
      this.getCountries();
      await this.route.queryParamMap
        .subscribe(async (params) => {
          this.orderObj = { ...params.keys, ...params };
          if (Object.keys(this.orderObj).length > 2) {
            this.filtrosActivos = true
            const formValues = {};
            for (const param in params) {
              formValues[param] = params[param];
            }
            this.formFiltersBusiness.patchValue(formValues['params']);
          }
          if (this.orderObj.params.pag) {
            await this.getNegocios(this.orderObj.params.pag);
          } else {
            await this.getNegocios()
          }
        }
        );
      /* this.getLists();
      this.calcularTotal(); */
      //this.getQuotations();
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    for (const controlName in this.formFiltersBusiness.controls) {
      const control = this.formFiltersBusiness.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
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
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  resetFiltros() {
    for (const controlName in this.formFiltersBusiness.controls) {
      this.formFiltersBusiness.get(controlName).setValue('');
    }
    this.filtrosActivos = false
  }

  paginacion: any
  handlePageEvent(event: PageEvent) {
    this.getNegocios(event.pageIndex + 1)
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

  async getNegocios(page = 1) {
    this.paginationBusiness.page = page;
    this.loading = true;
    let params = {
      ...this.paginationBusiness, ...this.formFiltersBusiness.value
    }
    var paramsurl = this.SetFiltros(this.paginationBusiness.page);
    this.location.replaceState('/crm/negocios', paramsurl.toString());
    await this._negocios.getBusinesses(params).toPromise().then((resp: any) => {
      this.loading = false;
      this.paginacion = resp.data
      this.business = resp.data.data;
      this.paginationBusiness.collectionSize = resp.data.total;
      this.getLists();
      this.calcularTotal();
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
      this.negocios_primera_etapa = this.business.filter(
        (t) => t.status === 'Prospección'
      );
      this.negocios_segunda_etapa = this.business.filter(
        (t) => t.status === 'Presupuesto'
      );
      this.negocios_tercera_etapa = this.business.filter(
        (t) => t.status === 'Cotización'
      );
      this.negocios_cuarta_etapa = this.business.filter(
        (t) => t.status === 'Negociación'
      );
      this.negocios_quinta_etapa = this.business.filter(
        (t) => t.status === 'Adjudicación'
      );
    }, 1000);

  }

  calcularTotal() {
    this.total = {
      first: 0,
      second: 0,
      third: 0,
      quarter: 0,
      fifth: 0
    };
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
    this.negocios_tercera_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.third += el.budget.total_cop;
      });
    });
    this.negocios_cuarta_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.quarter += el.budget.total_cop;
      });
    });
    this.negocios_quinta_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.fifth += el.budget.total_cop;
      });
    });
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

  get process_description_valid() {
    return (
      this.form.get('request_description').invalid &&
      this.form.get('request_description').touched
    );
  }
}
