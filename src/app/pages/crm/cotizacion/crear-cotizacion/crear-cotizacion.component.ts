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
  commercial_terms = `*LOS PRECIOS ANTERIORES NO INCLUYEN I.V.A.
  *Tiempo de entrega: 10 semanas
  *Forma de pago: 30 días fecha factura
  *Validez de la oferta: 30 días
  *Garantía: 1 año por defectos de fabricación
  *OFERTAS Y DOCUMENTOS: Todos los documentos técnicos continúan siendo propiedad intelectual de MAQUINADOS Y MONTAJES S.A.S. Cada uso de estos documentos, incluyendo su emisión, copia y divulgación quedan prohibidas sin el consentimiento explícito por escrito, en caso de violación de estos deberes, el cliente asume la plena responsabilidad en virtud de los dispositivos de la Ley.
  *PRECIOS: En el evento en que trascurridos más de 3 meses calendario luego de realizar la entrega formal del material, herramienta, repuesto y/o cualquier otro elemento vendido por MAQUINADOS Y MONTAJES S.A.S. y que por razones imputables al cliente no se haga posible su instalación en el término señalado, facultara a MAQUINADOS Y MONTAJES S.A.S. para el replanteo de los precios de instalación los cuales serán evaluados por el cliente para su aprobación. El valor estipulado en la cotización se mantendrá al cliente por un término máximo de 30 días. Cualquier cambio, solicitud adicional, variación de medidas, que afecten el alcance
  estipulado en la cotización inicial ameritará una nueva cotización, la
  cual respecto al precio se convendrá entre las partes. <br />
  *ADICIONALES: El trabajo adicional a lo estipulado dentro de la
  cotización que se llegase a solicitar por el cliente será calculado
  aparte y su precio se convendrá entre las partes de común acuerdo.
  <br />
  *ENTREGA: El cliente debe revisar y recibir la mercancía inmediatamente
  después de que esta haya llegado al lugar del recibo. Si el comprador
  explícita o silenciosamente haya desistido de revisar la mercancía a la
  hora del recibo, se considera que la mercancía ha sido suministrada y
  debidamente recibida según las condiciones contractuales. <br />
  *PENALIDAD POR RETRACTACIÓN: En el evento en que luego de emitida la
  orden de compra por parte del cliente y este llegase a retractarse
  encontrándose MAQUINADOS Y MONTAJES S.A.S. en producción de los
  elementos solicitados, estos facturaran al cliente en el mismo
  porcentaje en que se encuentren al momento de la retractación. En caso
  tal de no haberse iniciado la producción el cliente asumirá una
  penalidad del 10% sobre el valor de la orden de compra. <br />
  *RESERVA DE DOMINIO: MAQUINADOS Y MONTAJES S.A.S. se reserva el dominio
  de propiedad sobre todas las mercancías suministradas, incluyendo las
  piezas de repuesto y sustitución e incluso cuando estas hayan sido
  montadas sobre el equipamiento del cliente, hasta el momento del pago
  definitivo por parte del cliente. Mientras tanto, para mayor brevedad
  estas mercancías se llamarán en este documento mercancías de reserva. El
  comprador tiene el deber de guardar el valor de la mercancía de reserva
  y se compromete informar inmediatamente a MAQUINADOS Y MONTAJES S.A.S.
  en el caso de pretensiones presentadas por terceros hacia la mercancía.
  El comprador se compromete informar a sus clientes de que todas las
  mercancías suministradas por MAQUINADOS Y MONTAJES S.A.S. continúan
  siendo propiedad de esta y que la propiedad no puede ser transferida a
  los clientes antes del pago definitivo de las cuantías que se adeuden.`
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
    private _terceros: TercerosService
  ) { }


  ngOnInit(): void {
    this.path = this.route.snapshot.url[0].path;
    this.getTRM();
    this.createForm();
    this.getCities();
    this.getThirdParties();
    this.getBudgets();
    switch (this.path) {
      case 'crear':

        break;
      case 'editar':
        this.route.params.subscribe(params => {
          this.id = params['id'];
          this.getQuotation(this.id, 'editar')
        })
        break;
      case 'copiar':
        this.route.params.subscribe(params => {
          this.id = params['id'];
          this.getQuotation(this.id, 'copiar')
        })
        break;
      default:
        break;
    }
  }

  getThirdParties() {
    this._terceros.getThirds().subscribe((res: any) => {
      this.thirdParties = res.data;
    })
  }

  getQuotation(id, param) {
    this.loading = true;
    this._quotation.getQuotation(id).subscribe((res: any) => {
      this.quotation = res.data;
      /* this.headerData.Codigo = 'COT' + res.data.id
      this.headerData.Fecha = res.data.created_at */
      this.loading = false;
      this.form.patchValue({
        id: param == 'editar' ? res.data.id : '',
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
      customer_id: ['', Validators.required],
      destinity_id: ['', Validators.required],
      line: ['', Validators.required],
      trm: [this.trm, Validators.required],
      project: ['', Validators.required],
      budget_included: ['', Validators.required],
      budget: [''],
      budget_id: [''],
      //indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: 0,
      total_usd: 0,
      commercial_terms: [this.commercial_terms],
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,
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

  getCities() {
    this._apuPieza.getCities().subscribe((r: any) => {
      this.cities = r.data;
    })
  }

  save() {
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
  }

}
