import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of, Observable, Subject, concat, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, catchError, filter } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { BudgetService } from '../../presupuesto/budget.service';
import Swal from 'sweetalert2';
import { QuotationService } from '../quotation.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
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
  form: FormGroup;
  cities: any[] = [];
  apuPart$: Observable<any>;
  apuPartLoading = false;
  apuPartInput$ = new Subject<string>();
  minLengthTerm = 3;
  budgets: any[] = []
  trm:any;

  constructor(
    private _apuPieza: ApuPiezaService,
    private fb: FormBuilder,
    private _budgets: BudgetService,
    private _swal: SwalService,
    private _quotation: QuotationService,
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getTRM();
    this.createForm();
    this.getCities();
    this.loadApuParts();
    this.getBudgets();
  }

  getTRM(){
    let today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    this.http.get('https://www.datos.gov.co/resource/ceyp-9c7c.json', {params: {vigenciadesde: today}}).subscribe((res:any) => {
      this.trm = res[0].valor
      this.form.patchValue({trm: this.trm})
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
    (async () => {
      const { value: choice } = await Swal.fire({
        input: 'radio',
        icon: 'question',
        title: '¿Incluir detalles?',
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
      if (choice && choice == 'si') {
        //console.log('si')
      } else if (choice && choice == 'no') {
        item.items.forEach(element => {
          this.itemsQuotation.addItems(element, 'only_item')
        });
      }
    })()
  }

  getBudgets() {
    this._budgets.getAll().subscribe((res: any) => {
      this.budgets = res.data;
    })
  }


  loadApuParts() {
    this.apuPart$ = concat(
      of([]), // default items
      this.apuPartInput$.pipe(
        filter((res: any) => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(600),
        tap(() => this.apuPartLoading = true),
        switchMap(name => {
          return this._apuPieza.getClient({ name }).pipe(
            map((r: any) => { return r.data }),
            catchError(() => of([])), // empty list on error
            tap(() => this.apuPartLoading = false)
          )
        })
      )
    );
  }
  viewElements: boolean
  disabledMoney() {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Esta acción no podrá cambiarse más adelante',
      icon: 'question',
    }).then((r) => {
      if(r.isConfirmed){
        this.form.controls.money_type.disable()
        this.viewElements = true
      } else {
        this.form.get('money_type').reset()
        this.viewElements = false
      }
    })
  }

  createForm() {
    this.form = this.fb.group({
      money_type: ['', Validators.required],
      customer_id: ['', Validators.required],
      destinity_id: ['', Validators.required],
      line: ['', Validators.required],
      trm: [this.trm, Validators.required],
      project: ['', Validators.required],
      budget_included: ['', Validators.required],
      budget: [''],
      //indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: 0,
      total_usd: 0,
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,
    });
  }

  getCities() {
    this._apuPieza.getCities().subscribe((r: any) => {
      this.cities = r.data;
    })
  }

  save() {

  }

}
