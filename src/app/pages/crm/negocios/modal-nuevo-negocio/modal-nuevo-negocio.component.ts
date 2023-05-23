import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { QuotationService } from '../../cotizacion/quotation.service';
import { NegociosService } from '../negocios.service';
import { ModalNoCloseService } from 'src/app/core/services/modal-no-close.service';
import { ApuConjuntoService } from '../../apu-conjunto/apu-conjunto.service';
import { BudgetService } from '../../presupuesto/budget.service';

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
  business_id: any;
  contacts: any[];
  form: FormGroup;
  budgetsSelected: any[] = [];
  quotationSelected: any[] = [];
  apuSelected: any[] = [];
  quotations: any[] = [];
  budgets: any[] = [];
  loading: boolean = false;
  cities: any[] = [];
  preDataSend = {};
  types: any[] = [];
  countries: any[];
  reload: boolean;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _negocios: NegociosService,
    private _quotation: QuotationService,
    private _budget: BudgetService,
    private _swal: SwalService,
    private _user: UserService,
    private router: Router,
    private _apuConjunto: ApuConjuntoService,
    private _modal: ModalNoCloseService,
    public _consecutivos: ConsecutivosService,
  ) {
    this.id = this._user?.user?.person?.id;
  }

  ngOnInit(): void {
    this.datosCabecera.Fecha = new Date().toString();
    this.datosCabecera.Titulo = 'Nuevo negocio';
    this.createForm();
    this.getCompanies();
    this.getCities();
    this.getTypes();
    this.getContacts();
    this.route?.paramMap?.subscribe(params => {
      this.business_id = params?.get('id');
      if (this.business_id) {
        this.getBusiness(this.business_id);
      }
    })
    if (!this.business_id) {
      this.getConsecutivo();
    }
  }

  addBudget(e) {
    let cont = 0;
    e?.forEach(element => {
      if (!this.budgetsSelected?.some(bud => bud?.id == element?.id)) {
        this.budgetsSelected?.push(element)
      } else {
        cont++;
      }
    });
    if (cont > 0) {
      this._swal.show({
        icon: 'info',
        title: 'Alerta',
        text: 'Algunos presupuestos no fueron agregados porque ya se encuentran en la lista.',
        showCancel: false
      })
    }
  }

  addQuotation(e) {
    let cont = 0;
    e?.forEach(element => {
      if (!this.quotationSelected?.some(quot => quot?.id == element?.id)) {
        this.quotationSelected?.push(element)
      } else {
        cont++;
      }
    });
    if (cont > 0) {
      this._swal.show({
        icon: 'info',
        title: 'Alerta',
        text: 'Algunas cotizaciones no fueron agregadas porque ya se encuentran en la lista.',
        showCancel: false
      })
    }
  }

  async getTypes() {
    await this._negocios.indexType().toPromise().then((res: any) => {
      this.types = res?.data;
    })
  }

  async reloadData() {
    this.reload = true;
    this.getCompanies();
    this.getCities();
    await this.getTypes();
    this.reload = false
  }

  openModal(content) {
    this.preDataSend = {
      text: 'Llenar',
      city_id: this.form.get('city_id').value,
      third_party_id: this.form.get('third_party_id').value,
      third_party_person_id: this.form.get('third_party_person_id').value,
    }
    this._modal.openNoClose(content, 'xl')
  }

  getBusiness(id) {
    this.loading = true;
    this._negocios.getBusiness(id).subscribe((res: any) => {
      this.form.patchValue({
        id: res?.data?.id,
        name: res?.data?.name,
        description: res?.data?.description,
        third_party_id: res?.data?.third_party_id,
        third_party_person_id: res?.data?.third_party_person_id,
        city_id: res?.data?.city_id,
        date: res?.data?.date,
        person_id: res?.data?.person_id,
        business_type_id: res?.data?.business_type_id,
        format_code: res?.data?.formmat_code,
        code: res?.data?.code
      })
      this.datosCabecera.Codigo = res?.data?.code;
      this.datosCabecera.CodigoFormato = res?.data?.format_code;
      this.datosCabecera.Fecha = res?.data?.created_at;
      this.datosCabecera.Titulo = 'Editar negocio'
      this.loading = false;
    })
  }

  getApus(e: any[]) {
    let cont = 0;
    e?.forEach(apu => {
      if (!this.apuSelected?.some(x => (x?.apu_id == apu?.apu_id && x?.type_module == apu?.type_module))) {
        this.apuSelected.push(apu)
      } else {
        cont++;
      }
      if (cont > 0) {
        this._swal.show({
          icon: 'info',
          title: 'Alerta',
          text: 'Algunos APU no fueron agregados porque ya se encuentran en la lista.',
          showCancel: false
        })
      }
    });
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
    let id = this.apuSelected?.indexOf(item)
    this.apuSelected?.splice(id, 1)
  }

  deleteBudget(item) {
    let id = this.budgetsSelected?.indexOf(item)
    this.budgetsSelected?.splice(id, 1)
  }

  deleteQuotation(item) {
    let id = this.quotationSelected?.indexOf(item)
    this.quotationSelected?.splice(id, 1)
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('businesses').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r?.data?.format_code
      this.form.patchValue({ format_code: this.datosCabecera?.CodigoFormato })
      this.construirConsecutivo(this.form.get('city_id').value, r)
      this.form.get('city_id').valueChanges.subscribe(value => {
        if (!this.business_id) {
          this.construirConsecutivo(value, r)
        }
      });
    })
  }

  construirConsecutivo(value, r, context = '') {
    if (r?.data?.city) {
      let city = this.cities?.find(x => x?.value === value);
      if (city && !city?.abbreviation) {
        this.form.get('city_id')?.setValue(null);
        this._swal.show({
          icon: 'error',
          title: 'Error',
          text: 'El destino no tiene abreviatura.',
          showCancel: false
        })
      } else {
        let con = this._consecutivos.construirConsecutivo(r?.data, city?.abbreviation);
        this.datosCabecera.Codigo = con
        this.form.patchValue({
          code: con
        })
      }
    } else {
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con
      this.form.patchValue({
        code: con
      })
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: [],
      name: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', Validators.maxLength(65535)],
      third_party_id: [null, Validators.required],
      third_party_person_id: [null, Validators.required],
      /* country_id: [null, Validators.required], */
      city_id: [null, Validators.required],
      date: ['', Validators.required],
      person_id: [this.id],
      format_code: [''],
      business_type_id: [''],
      code: ['']
    });

    this.form.get('third_party_id').valueChanges.subscribe(value => {
      this.form.get('third_party_person_id').reset()
    })
  }

  async getCities() {
    await this._negocios.getMunicipalities().toPromise().then((r: any) => {
      this.cities = r.data;
    })
  }

  getCompanies() {
    this._negocios.getThirds().subscribe(
      (resp: any) => {
        this.companies = resp?.data;
      },
      () => { },
      () => {
      }
    );
  }

  getContacts() {
    this._negocios.getThirdPartyPersonIndex().subscribe((resp: any) => {
      this.contacts = resp?.data;
    });
  }

  saveBusiness() {
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a ' + (this.form?.value?.id ? 'editar' : 'crear') + ' el negocio',
        icon: 'question',
        showCancel: true,
      }).then((r) => {
        if (r.isConfirmed) {
          if (this.form?.value?.id) {
            this._negocios.updateBasicData(this.form.value).subscribe((res: any) => {
              if (res.status) {
                this.swalAlert();
                this.router.navigateByUrl('/crm/negocios');
              } else {
                this._swal.hardError();
              }
            },
              (error) => {
                this._swal.hardError();
              }
            )
          } else {
            this.form.addControl('budgets', this.fb.control(this.budgetsSelected));
            this.form.addControl('quotations', this.fb.control(this.quotationSelected));
            this.form.addControl('apu', this.fb.control(this.apuSelected));
            this._negocios.saveNeg(this.form.value).subscribe((r: any) => {
              if (r.status) {
                this.swalAlert();
                this.router.navigateByUrl('/crm/negocios')
              } else {
                this._swal.hardError();
              }
            }, (error) => {
              this._swal.hardError();
            });
          }
        }
      })

    } else {
      this.form.markAllAsTouched()
      this._swal.incompleteError();
    }

  }

  swalAlert() {
    this._swal.show({
      icon: 'success',
      title: 'Operación exitosa',
      text: 'Se ha ' + (this.business_id ? 'actualizado' : 'creado') + ' el negocio',
      timer: 1000,
      showCancel: false
    })
  }

  addApuPieza(apu) {
    this._modal.close();
    this._apuConjunto.getApuPartToAdd(apu.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }

  addNewAPUConjunto(apu) {
    this._modal.close();
    this._apuConjunto.getApuSetToAdd(apu.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }

  addNewAPUServicio(apu) {
    this._modal.close();
    this._apuConjunto.getApuServiceToAdd(apu.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }

  addNewBudget(pre) {
    this._modal.close();
    this._budget.getBudgetToAdd(pre.id).subscribe((res: any) => {
      this.budgetsSelected.push(res?.data)
    })
  }

  addNewQuotation(quot) {
    this._modal.close();
    this._quotation.getQuotationToAdd(quot.id).subscribe((res: any) => {
      this.quotationSelected.push(res?.data)
    })
  }

}
