import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { QuotationService } from '../../cotizacion/quotation.service';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-modal-nuevo-negocio',
  templateUrl: './modal-nuevo-negocio.component.html',
  styleUrls: ['./modal-nuevo-negocio.component.scss']
})
export class ModalNuevoNegocioComponent implements OnInit {
  @ViewChild('newBusiness') newBusiness;
  @Output() updated = new EventEmitter<any>();
  today = new Date().toISOString().slice(0, 10);
  companies: any[];
  id;
  contacts: any[];
  form: FormGroup;
  formFiltersBudgets: FormGroup;
  budgetsSelected: any[] = [];
  quotationSelected: any[] = [];
  quotations: any[] = [];
  budgets: any[] = [];
  cities: any[] = [];
  countries: any[];
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
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private _quotation: QuotationService,
    private _swal: SwalService,
    private _user: UserService
  ) {
    this.id = this._user.user.person.id;
  }

  ngOnInit(): void {

  }

  openModal() {
    this._modal.open(this.newBusiness, 'xl')
    this.createForm();
    this.createFormFiltersBudgets();
    this.getCompanies();
    this.getCountries();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      third_party_id: [null, Validators.required],
      third_party_person_id: [null, Validators.required],
      country_id: [null, Validators.required],
      city_id: [null, Validators.required],
      date: ['', Validators.required],
      person_id: [this.id]
    });
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

  getCompanies() {
    this._negocios.getThirds().subscribe(
      (resp: any) => {
        this.companies = resp.data;
      },
      () => { },
      () => {
      }
    );
  }

  getContacts() {
    this._negocios.getThirdPartyPersonForThird(this.form.value.third_party_id).subscribe((resp: any) => {
      this.contacts = resp.data;
    });
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
            this.updated.emit()
            //this.getNegocios();
          });
          //this.addEventToHistory('Negocio Creado');
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

}
