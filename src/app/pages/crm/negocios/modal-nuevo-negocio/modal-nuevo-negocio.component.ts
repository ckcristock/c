import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { QuotationService } from '../../cotizacion/quotation.service';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-modal-nuevo-negocio',
  templateUrl: './modal-nuevo-negocio.component.html',
  styleUrls: ['./modal-nuevo-negocio.component.scss']
})
export class ModalNuevoNegocioComponent implements OnInit {
  @ViewChild('apus') apus: any
  @ViewChild('newBusiness') newBusiness;
  @Output() updated = new EventEmitter<any>();
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  today = new Date().toISOString().slice(0, 10);
  companies: any[];
  id;
  contacts: any[];
  form: FormGroup;
  formFiltersBudgets: FormGroup;
  loadingBudgets: boolean;
  loadingQuotations: boolean;
  budgetsSelected: any[] = [];
  quotationSelected: any[] = [];
  apuSelected: any[] = [];
  quotations: any[] = [];
  budgets: any[] = [];
  cities: any[] = [];
  people: any[] = []
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
  form_filters_quotations: FormGroup;
  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private _quotation: QuotationService,
    private _swal: SwalService,
    private _user: UserService,
    private _person: PersonService,
    private router: Router,
    public _consecutivos: ConsecutivosService,
  ) {
    this.id = this._user.user.person.id;
  }

  ngOnInit(): void {
    this.datosCabecera.Fecha = new Date().toString();
    this.datosCabecera.Titulo = 'Nuevo negocio';
    this.createForm();
    this.createFormFiltersBudgets();
    this.createFormFiltersQuotations();
    this.getCompanies();
    this.getCountries();
    this.getPeople();
    this.getConsecutivo();
  }

  openModal() {
    //this._modal.open(this.newBusiness, 'xl')

  }

  getApus(e: any[]) {
    e.forEach(apu => {
      const exist = this.apuSelected.some(x => (x.apu_id == apu.apu_id && x.type_module == apu.type_module))
      !exist ?
        this.apuSelected.push(apu) :
        this._swal.show({ icon: 'error', title: 'Error', text: 'Ya agregaste este APU', showCancel: false })
    });
    console.log(this.apuSelected)
  }

  findApus() {
    this.apus.openConfirm()
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

  deleteApu(item) {
    let id = this.apuSelected.indexOf(item)
    this.apuSelected.splice(id, 1)
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('businesses').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      this.construirConsecutivo(r);
    })
  }

  construirConsecutivo(r) {
    let con = this._consecutivos.construirConsecutivo(r.data);
    this.datosCabecera.Codigo = con
    this.form.patchValue({
      code: con
    })
    if (r.data.city) {
      this.form.get('city_id').valueChanges.subscribe(value => {
        let city = this.cities.find(x => x.value === value)
        let con = this._consecutivos.construirConsecutivo(r.data, city.abbreviation);
        this.datosCabecera.Codigo = con
        this.form.patchValue({
          code: con
        })
      });
    }
  }

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      third_party_id: [null, Validators.required],
      third_party_person_id: [null, Validators.required],
      country_id: [null, Validators.required],
      city_id: [null, Validators.required],
      date: ['', Validators.required],
      person_id: [this.id],
      format_code: [''],
      code: ['']
    });

    this.form.get('third_party_id').valueChanges.subscribe(value => {
      this.getContacts(value);
      this.getBudgets(1, value);
      this.getQuotations(1, value);
      this.form.get('third_party_person_id').reset()
    })
  }

  createFormFiltersQuotations() {
    this.form_filters_quotations = this.fb.group({
      city: '',
      code: '',
      client: '',
      description: '',
      line: '',
    })
    this.form_filters_quotations.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getQuotations();
    })
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

  getContacts(id) {
    this._negocios.getThirdPartyPersonForThird(id).subscribe((resp: any) => {
      this.contacts = resp.data;
    });
  }

  createFormFiltersBudgets() {
    this.formFiltersBudgets = this.fb.group({
      code: '',
      date: '',
      customer: '',
      municipality_id: '',
      line: '',
      person_id: ''
    })
    this.formFiltersBudgets.valueChanges
      .pipe(debounceTime(500)).subscribe(r => this.getBudgets())
  }

  getBudgets(page = 1, id = '') {
    this.loadingBudgets = true
    this.budgetsSelected = []
    this.paginationBudgets.page = page;
    let params = {
      ...this.paginationBudgets,
      ...this.formFiltersBudgets.value,
      third_party_id: id
    }
    this._negocios.getBudgets(params).subscribe((resp: any) => {
      this.budgets = resp.data.data;
      this.loadingBudgets = false
      this.paginationBudgets.collectionSize = resp.data.total;
    });
  }

  getQuotations(page = 1, id = '') {
    this.quotationSelected = []
    this.loadingQuotations = true
    this.paginationQuotations.page = page;
    let params = {
      ...this.paginationQuotations,
      ...this.form_filters_quotations.value,
      third_party_id: id
    }
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.loadingQuotations = false;
      this.paginationQuotations.collectionSize = res.data.total;
    })
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

  guardarPresupuesto(event, item) {
    if (event.checked) {
      this.budgetsSelected.push((item));
    } else {
      this.budgetsSelected = this.budgetsSelected.filter((selected) => {
        return selected.id !== event.source.id
      });
    }

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

  openClose(matPanel) {
    matPanel.toggle();
  }

  saveBusiness() {
    console.log(this.form.value)
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
          this.form.addControl('apu', this.fb.control(this.apuSelected));
          this.budgetsSelected.reduce((a, b) => {
            return this.form.addControl('budget_value', this.fb.control(a + b.total_cop))
          }, 0)
          this.quotationSelected.reduce((a, b) => {
            return this.form.addControl('quotation_value', this.fb.control(a + b.total_cop))
          }, 0)
          this._negocios.saveNeg(this.form.value).subscribe(r => {
            this.form.reset();
            this.budgetsSelected = [];
            this.quotationSelected = [];
            this.budgets = [];
            this.quotations = [];
            this.router.navigateByUrl('/crm/negocios')
            //this.getNegocios();
          });
          //this.addEventToHistory('Negocio Creado');
        }
      })
    } else {
      this.form.markAllAsTouched()
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Completa todos los campos requeridos para poder continuar',
        showCancel: false
      })
    }

  }

}
