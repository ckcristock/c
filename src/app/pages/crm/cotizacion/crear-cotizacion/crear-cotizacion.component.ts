import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Observable, Subject, concat, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, catchError, filter } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { BudgetService } from '../../presupuesto/budget.service';
import { TercerosService } from '../../terceros/terceros.service';
import Swal from 'sweetalert2';
import { QuotationService } from '../quotation.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { NegociosService } from '../../negocios/negocios.service';
import { consts } from 'src/app/core/utils/consts';
@Component({
  selector: 'app-crear-cotizacion',
  templateUrl: './crear-cotizacion.component.html',
  styleUrls: ['./crear-cotizacion.component.scss'],
  providers: [DatePipe]
})
export class CrearCotizacionComponent implements OnInit {
  @ViewChild('itemsQuotation') itemsQuotation;
  @ViewChild('modalBudgets') modalBudgets;
  @Input('preData') preData = undefined;
  @Output() saveForBusiness = new EventEmitter;
  public datos: any = {
    Titulo: 'Nueva cotización',
    Fecha: new Date()
  }
  d = new Date();
  today = this.datePipe?.transform(this.d?.setDate(this.d?.getDate()), 'yyyy-MM-dd')
  form: FormGroup;
  cities: any[] = [];
  apuPart$: Observable<any>;
  apuPartLoading = false;
  apuPartInput$ = new Subject<string>();
  minLengthTerm = 3;
  budgets: any[] = []
  trm: any;
  currentRoute: string;
  path: string;
  id: number;
  quotation: any;
  loading: boolean;
  loadingView: boolean;
  masksMoney = consts
  thirdParties: any[] = [];
  reload: boolean;
  constructor(
    private _apuPieza: ApuPiezaService,
    private fb: FormBuilder,
    private _budgets: BudgetService,
    private _swal: SwalService,
    private _quotation: QuotationService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private _terceros: TercerosService,
    public _texteditor: Texteditor2Service,
    public _consecutivos: ConsecutivosService,
    private _negocios: NegociosService,
  ) {
    this.path = this.route?.snapshot?.url[0]?.path;
  }

  async ngOnInit() {
    this.loadingView = true;
    this.route?.params?.subscribe(params => {
      this.id = params['id'];
    })
    this.getTexts();
    this.getTRM();
    this.createForm();
    this.getThirdParties();
    this.getContacts();
    this.getBudgets();
    await this.getCities();
    if (this.path != 'crear' && !this.preData) {
      this.getQuotation(this.id)
    }
    if (this.preData) {
      this.form?.patchValue({
        destinity_id: this.preData?.city_id,
        customer_id: this.preData?.third_party_id,
        third_party_person_id: this.preData?.third_party_person_id,
      })
    }
    this.loadingView = false
    await this.getConsecutivo();
  }

  async reloadData() {
    this.reload = true;
    this.getTexts();
    this.getBudgets();
    if (this.path != 'crear') {
      this.getQuotation(this.id)
    }
    this.getThirdParties();
    this.getContacts();
    await this.getCities();
    this.reload = false
  }

  async getConsecutivo() {
    await this._consecutivos?.getConsecutivo('quotations')?.toPromise()?.then((r: any) => {
      this.datos.CodigoFormato = r?.data?.format_code
      this.form?.patchValue({ format_code: this.datos?.CodigoFormato })
      if (this.path !== 'editar') {
        this.buildConsecutivo(this.form?.get('destinity_id')?.value, r)
        this.form?.get('destinity_id')?.valueChanges?.subscribe(value => {
          this.buildConsecutivo(value, r)
        });
      } else {
        this.datos.Codigo = this.quotation?.code
        this.form?.patchValue({
          code: this.quotation?.code
        })
        this.form?.get('destinity_id')?.disable()
      }
    })
  }
  contacts: any[];
  getContacts() {
    this._negocios?.getThirdPartyPersonIndex()?.subscribe((resp: any) => {
      this.contacts = resp?.data;
    });
  }

  buildConsecutivo(value, r, context = '') {
    if (r?.data?.city) {
      let city = this.cities?.find(x => x?.value === value);
      if (city && !city?.abbreviation) {
        this.form?.get('destinity_id')?.setValue(null);
        this._swal?.show({
          icon: 'error',
          title: 'Error',
          text: 'El destino no tiene abreviatura.',
          showCancel: false
        })
      } else {
        let con = this._consecutivos?.construirConsecutivo(r?.data, city?.abbreviation, context);
        this.datos.Codigo = con
        this.form?.patchValue({
          code: con
        })
      }
    } else {
      let con = this._consecutivos?.construirConsecutivo(r?.data);
      this.datos.Codigo = con
      this.form?.patchValue({
        code: con
      })
    }
  }

  getThirdParties() {
    this._terceros?.getThirds()?.subscribe((res: any) => {
      this.thirdParties = res?.data;

    })
  }

  getTexts() {
    this._quotation?.getTexts()?.subscribe((res: any) => {
      this.form?.patchValue({
        commercial_terms: res?.data?.commercial_terms,
        legal_requirements: res?.data?.legal_requirements,
        technical_requirements: res?.data?.technical_requirements
      })
    })
  }

  getQuotation(id) {
    this.loading = true;
    this._quotation?.getQuotation(id)?.subscribe((res: any) => {
      if (res?.data?.status == 'Pendiente') {
        this.quotation = res?.data;
        /* this.headerData.Codigo = 'COT' + res.data.id
        this.headerData.Fecha = res.data.created_at */
        this.loading = false;
        this.form?.patchValue({
          id: this.path == 'editar' ? res?.data?.id : '',
          money_type: res?.data?.money_type,
          date: res?.data?.date,
          customer_id: res?.data?.customer_id,
          third_party_person_id: res?.data?.third_party_person_id,
          destinity_id: res?.data?.destinity_id,
          trm: res?.data?.trm,
          description: res?.data?.description,
          included: res?.data?.included,
          budget: res?.data?.budget,
          budget_id: res?.data?.budget_id,
          observation: res?.data?.observation,
          items: res?.data?.items,
          total_cop: res?.data?.total_cop,
          total_usd: res?.data?.total_usd,
          commercial_terms: res?.data?.commercial_terms,
          legal_requirements: res?.data?.legal_requirements,
          technical_requirements: res?.data?.technical_requirements
        })
        this.getContacts()
        if (res?.data?.included) {
          this.form?.get('included')?.disable()
          this.form?.get('budget')?.disable()
        }
        res?.data?.items?.forEach(element => {
          const action = element?.sub_items?.length > 0 ? 'subitems' : 'withSub';
          let cat = element?.quotationitemable_type == 'App\\Models\\Budget' ? 'budget' : 'apu';
          this.itemsQuotation?.addItems(element, action, cat, true);
        });
      } else {
        this.router?.navigate(['/notauthorized'])
      }
    })
  }

  createForm() {
    this.form = this.fb?.group({
      id: [''],
      money_type: ['cop', Validators?.required],
      date: new Date(),
      customer_id: [null, Validators?.required],
      destinity_id: [null, Validators?.required],
      trm: [this.trm, Validators?.required],
      description: [''],
      included: [''],
      budget: [''],
      budget_id: [''],
      //indirect_costs: this.fb.array([]),
      observation: [''],
      items: this.fb?.array([]),
      total_cop: 0,
      total_usd: 0,
      commercial_terms: [null, Validators?.required],
      legal_requirements: [null],
      technical_requirements: [null],
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,
      format_code: [''],
      code: [''],
      third_party_person_id: [null, Validators?.required]
    });
    this.form?.get('included')?.valueChanges?.subscribe(r => {
      const items = this.form?.get('items') as FormArray;
      for (let i = items?.length - 1; i >= 0; i--) {
        items?.removeAt(i);
      }
    })
  }

  openBudgets(e) {
    if (e?.checked) {
      this.modalBudgets?.openModal()
    }
  }

  getTRM() {
    this.http?.get('https://www.datos.gov.co/resource/ceyp-9c7c.json', { params: { vigenciadesde: this.today } })?.subscribe((res: any) => {
      if (!res[0]) {
        this.today = this.datePipe?.transform(this.d?.setDate(this.d?.getDate() - 1), 'yyyy-MM-dd')
        this.getTRM()
      } else {
        this.trm = res[0]?.valor
        this.form?.patchValue({ trm: this.trm })
      }
    })
  }

  //*Typeahead que filtra el presupuesto
  search: OperatorFunction<string, readonly { name }[]> = (text$: Observable<string>) =>
    text$?.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.budgets?.filter((v) => v?.name?.toLowerCase()?.indexOf(term?.toLowerCase()) > -1)?.slice(0, 10),
      ),
    );
  formatter = (x: { name: string, id }) => x?.name;
  //*Fin del typeahead

  openNewTab(id) {
    let uri = '/crm/presupuesto/ver';
    const url = this.router?.serializeUrl(
      this.router?.createUrlTree([uri + '/' + id])
    );
    window?.open(url, '_blank');
  }
  budgetSelected(item) {
    if (this.form?.controls?.money_type?.value != '') {
      (async () => {
        const { value: choice } = await Swal?.fire({
          input: 'radio',
          icon: 'question',
          title: '¿Incluir detalles?',
          text: 'La cotización estará ligada a este presupuesto y no podrá ser cambiada más adelante.',
          inputOptions: {
            'si': 'Sí',
            'no': 'No',
          },
          confirmButtonColor: '#A3BD30',
          confirmButtonText: 'Confirmar',
          inputValidator: (value) => {
            if (!value) {
              return 'Debes seleccionar una acción!'
            }
          }
        })
        if (choice) {
          const action = choice === 'si' ? 'subitems' : 'withSub';
          this.form?.patchValue({ budget_id: item?.id });
          this.form?.controls?.budget?.disable();
          this.form?.controls?.included?.disable();
          item?.items?.forEach(element => {
            this.itemsQuotation?.addItems(element, action, 'budget');
          });
        } else {
          this.form?.controls?.budget?.reset();
        }
      })()
    } else {

      this._swal?.show({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Elige el tipo de moneda antes de agregar un presupuesto',
        showCancel: false
      })?.then(r => {
        this.form?.get('budget')?.reset()
      })
    }
  }

  getBudgets() {
    this._budgets?.getAll()?.subscribe((res: any) => {
      this.budgets = res?.data;
    })
  }


  viewElements: boolean
  disabledMoney() {
    this._swal?.show({
      title: '¿Estás seguro(a)?',
      text: 'Esta acción no podrá cambiarse más adelante',
      icon: 'question',
    })?.then((r) => {
      if (r?.isConfirmed) {
        this.form?.controls?.money_type?.disable()
        this.viewElements = true
      } else {
        this.form?.get('money_type')?.reset()
        this.viewElements = false
      }
    })
  }

  async getCities() {
    await this._apuPieza?.getCities()?.toPromise()?.then((r: any) => {
      this.cities = r?.data;
    })
  }

  save() {
    if (this.form?.valid) {
      this._swal?.show({
        title: '¿Estás seguro(a)?',
        text: '',
        icon: 'question',
      })?.then((r) => {
        if (r?.isConfirmed) {
          this._quotation?.save(this.form?.getRawValue())?.subscribe((res: any) => {
            this._swal?.show({
              title: 'Operación exitosa',
              icon: 'success',
              text: '',
              showCancel: false,
              timer: 1000
            })
            if (this.preData) {
              this.saveForBusiness?.emit(res?.data)
            } else {
              this.router?.navigate(['/crm/cotizacion'])
            }
          });
        }
      })
    } else {
      this._swal?.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Faltan datos requeridos. Completa toda la información e intenta de nuevo.',
        showCancel: false
      })
    }
  }

}
