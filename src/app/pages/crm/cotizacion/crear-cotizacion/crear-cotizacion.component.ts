import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-crear-cotizacion',
  templateUrl: './crear-cotizacion.component.html',
  styleUrls: ['./crear-cotizacion.component.scss'],
  providers: [DatePipe]
})
export class CrearCotizacionComponent implements OnInit {
  @ViewChild('itemsQuotation') itemsQuotation;
  public datos: any = {
    Titulo: 'Nueva cotización',
    Fecha: new Date()
  }
  d = new Date();
  today = this.datePipe.transform(this.d.setDate(this.d.getDate()), 'yyyy-MM-dd')
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
  thirdParties: any[] = [];
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
  ) {
    this.path = this.route.snapshot.url[0].path;
  }


  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
    this.getCommercialTerms();
    this.getTRM();
    this.createForm();
    this.getThirdParties();
    this.getBudgets();
    if (this.path != 'crear') {
      this.getQuotation(this.id)
    }
    await this.getCities();
    this.getConsecutivo();
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('quotations').subscribe((r: any) => {
      this.datos.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datos.CodigoFormato })
      if (this.path != 'editar') {
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.datos.Codigo = con
        this.form.patchValue({
          code: con
        })
      } else {
        this.datos.Codigo = this.quotation?.code
        this.form.patchValue({
          code: this.quotation?.code
        })
      }
      if (this.path == 'copiar') {
        let city = this.cities.find(x => x.value === this.form.controls.destinity_id.value)
        let con = this._consecutivos.construirConsecutivo(r.data, city.abbreviation);
        this.datos.Codigo = con
        this.form.patchValue({
          code: con
        })
      }
      if (r.data.city) {
        this.form.get('destinity_id').valueChanges.subscribe(value => {
          let city = this.cities.find(x => x.value === value)
          let con = this._consecutivos.construirConsecutivo(r.data, city.abbreviation);
          this.datos.Codigo = con
          this.form.patchValue({
            code: con
          })
        });
      }
    })
  }

  getThirdParties() {
    this._terceros.getThirds().subscribe((res: any) => {
      this.thirdParties = res.data;
    })
  }

  getCommercialTerms() {
    let params = {
      id: 1
    }
    this._quotation.getCommercialTerms(params).subscribe((res: any) => {
      this.form.patchValue({ commercial_terms: res.data.commercial_terms })
    })
  }

  getQuotation(id) {
    this.loading = true;
    this._quotation.getQuotation(id).subscribe((res: any) => {
      this.quotation = res.data;
      /* this.headerData.Codigo = 'COT' + res.data.id
      this.headerData.Fecha = res.data.created_at */
      this.loading = false;
      this.form.patchValue({
        id: this.path == 'editar' ? res.data.id : '',
        money_type: res.data.money_type,
        date: res.data.date,
        customer_id: res.data.customer_id,
        destinity_id: res.data.destinity_id,
        line: res.data.line,
        trm: res.data.trm,
        project: res.data.project,
        budget_included: res.data.budget_included,
        budget: res.data.budget,
        budget_id: res.data.budget_id,
        observation: res.data.observation,
        items: res.data.items,
        total_cop: res.data.total_cop,
        total_usd: res.data.total_usd,
        commercial_terms: res.data.commercial_terms
      })
      this.form.get('budget_included').disable()
      res.data.items.forEach(element => {
        const action = element.sub_items.length > 0 ? 'subitems' : 'withSub';
        this.itemsQuotation.addItems(element, action);
      });
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      money_type: ['cop', Validators.required],
      date: new Date(),
      customer_id: [null, Validators.required],
      destinity_id: [null, Validators.required],
      line: ['', Validators.required],
      trm: [this.trm, Validators.required],
      project: ['', Validators.required],
      budget_included: ['', Validators.required],
      budget: [''],
      budget_id: [''],
      //indirect_costs: this.fb.array([]),
      observation: ['', Validators.required],
      items: this.fb.array([]),
      total_cop: 0,
      total_usd: 0,
      commercial_terms: [null, Validators.required],
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,
      format_code: [''],
      code: ['']
    });
  }

  getTRM() {
    this.http.get('https://www.datos.gov.co/resource/ceyp-9c7c.json', { params: { vigenciadesde: this.today } }).subscribe((res: any) => {
      if (!res[0]) {
        this.today = this.datePipe.transform(this.d.setDate(this.d.getDate() - 1), 'yyyy-MM-dd')
        this.getTRM()
      } else {
        this.trm = res[0].valor
        this.form.patchValue({ trm: this.trm })
      }
    })
  }

  //*Typeahead que filtra el presupuesto
  search: OperatorFunction<string, readonly { line; project }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.budgets.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  formatter = (x: { name: string, id }) => x.name;
  //*Fin del typeahead

  budgetSelected(item) {
    if (this.form.controls.money_type.value != '') {
      (async () => {
        const { value: choice } = await Swal.fire({
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
          console.log(item)
          this.form.patchValue({ budget_id: this.form.controls.budget.value.id });
          this.form.controls.budget.disable();
          this.form.controls.budget_included.disable();
          item.items.forEach(element => {
            this.itemsQuotation.addItems(element, action);
          });
        } else {
          this.form.controls.budget.reset();
        }
      })()
    } else {

      this._swal.show({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Elige el tipo de moneda antes de agregar un presupuesto',
        showCancel: false
      }).then(r => {
        this.form.get('budget').reset()
      })
    }
  }

  getBudgets() {
    this._budgets.getAll().subscribe((res: any) => {
      this.budgets = res.data;
    })
  }


  viewElements: boolean
  disabledMoney() {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Esta acción no podrá cambiarse más adelante',
      icon: 'question',
    }).then((r) => {
      if (r.isConfirmed) {
        this.form.controls.money_type.disable()
        this.viewElements = true
      } else {
        this.form.get('money_type').reset()
        this.viewElements = false
      }
    })
  }

  async getCities() {
    await this._apuPieza.getCities().toPromise().then((r: any) => {
      this.cities = r.data;
    })
  }

  save() {
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: '',
        icon: 'question',
      }).then((r) => {
        if (r.isConfirmed) {
          this._quotation.save(this.form.getRawValue()).subscribe((res: any) => {
            this._swal.show({
              title: res.data,
              icon: 'success',
              text: '',
              showCancel: false,
              timer: 1000
            })
            this.router.navigate(['/crm/cotizacion'])
          });
        }
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Faltan datos requeridos. Completa toda la información e intenta de nuevo.',
        showCancel: false
      })
    }
  }

}
