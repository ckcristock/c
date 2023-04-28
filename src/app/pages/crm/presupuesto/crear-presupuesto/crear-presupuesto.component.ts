import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, map } from 'rxjs/operators';
import { CalculationBasesService } from '../../../ajustes/configuracion/base-calculos/calculation-bases.service';
import { BudgetService } from '../budget.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { consts } from 'src/app/core/utils/consts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.scss'],
})
export class CrearPresupuestoComponent implements OnInit {
  @Input('id') id;
  @Input('dataEdit') dataEdit;
  @Input('title') title = 'Nuevo presupuesto';

  indirectCosts: any = [];
  custumer$: Observable<any>;
  custumerLoading = false;
  custumerInput$ = new Subject<string>();
  minLengthTerm = 3;
  clients: any = [];
  forma: FormGroup;
  data = '';
  cities: any[] = []
  calculationBase: any = {}
  loading = false;
  path: string;
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  masksMoney = consts
  reload: boolean;
  constructor(
    private _apuPieza: ApuPiezaService,
    private fb: FormBuilder,
    private _calculationBase: CalculationBasesService,
    private _budget: BudgetService,
    private _swal: SwalService,
    private router: Router,
    public _consecutivos: ConsecutivosService,
    private route: ActivatedRoute,
  ) {
    this.path = this.route.snapshot.url[0].path;
  }

  async ngOnInit() {
    this.datosCabecera.Fecha = this.path != 'editar' ? new Date() : this.dataEdit?.created_at;
    this.datosCabecera.Titulo = this.title;
    this.loading = true;
    this.getClients();
    await this.getBases();
    this.createForm();
    await this.getIndirectCosts();
    await this.getCities();
    this.getConsecutivo();
    this.loading = false;
  }

  async reloadData() {
    this.reload = true;
    this.getClients();
    await this.getBases();
    await this.getIndirectCosts();
    await this.getCities();
    this.reload = false
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('budgets').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.forma.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      if (this.path !== 'editar') {
        this.buildConsecutivo(this.forma.get('destinity_id').value, r)
        this.forma.get('destinity_id').valueChanges.subscribe(value => {
          this.buildConsecutivo(value, r)
        });
      } else {
        this.datosCabecera.Codigo = this.dataEdit.code
        this.forma.patchValue({
          code: this.dataEdit.code
        })
        this.forma.get('destinity_id').disable()
      }
    })
  }

  buildConsecutivo(value, r, context = '') {
    let city = this.cities.find(x => x.value === value)
    let con = this._consecutivos.construirConsecutivo(r.data, city?.abbreviation, context);
    this.datosCabecera.Codigo = con
    this.forma.patchValue({
      code: con
    })
  }

  async getBases() {
    await this._calculationBase.getAll().toPromise().then((r: any) => {
      this.calculationBase = r.data.reduce((acc, el) => ({ ...acc, [el.concept]: el }), {})

      if (this.dataEdit) {
        this.calculationBase.trm.value = this.dataEdit.trm
      }
    })
  }
  async getIndirectCosts() {
    if (this.dataEdit) {
      this.indirectCosts =
        this.dataEdit.indirect_costs.reduce((acc, el) => {
          return [...acc,
          { text: el.indirect_cost.name, value: el.indirect_cost_id, percentage: el.percentage, apply_service: el.indirect_cost.apply_service }
          ]
        }, [])
    } else {
      await this._apuPieza.getIndirectCosts().toPromise().then((r: any) => {
        this.indirectCosts = r.data;
      });
    }
    this.indirectCostPush(this.indirecCostList);
  }


  getClients() {
    this._apuPieza.getClient().subscribe((r: any) => {
      this.clients = r.data;
    })
  }

  getCustumers() {
    this.custumer$ = concat(
      of([]), // default items
      this.custumerInput$.pipe(
        filter((res: any) => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(600),
        tap(() => this.custumerLoading = true),
        switchMap(name => {
          return this._apuPieza.getClient({ name }).pipe(
            map((r: any) => { return r.data }),
            catchError(() => of([])), // empty list on error
            tap(() => this.custumerLoading = false)
          )
        })
      )
    );
  }

  createForm() {
    this.forma = this.fb.group({
      id: (this.dataEdit && this.path == 'editar' ? this.dataEdit.id : ''),
      customer_id: [(this.dataEdit ? this.dataEdit.customer_id : null), Validators.required],
      destinity_id: [(this.dataEdit ? this.dataEdit.destinity_id : null), Validators.required],
      line: [(this.dataEdit ? this.dataEdit.line : ''), Validators.required],
      trm: [this.calculationBase.trm.value, Validators.required],
      project: [(this.dataEdit ? this.dataEdit.project : ''), Validators.required],
      indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: (this.dataEdit ? this.dataEdit.total_cop : 0),
      total_usd: (this.dataEdit ? this.dataEdit.total_usd : 0),
      unit_value_prorrateado_cop: (this.dataEdit ? this.dataEdit.unit_value_prorrateado_cop : 0),
      unit_value_prorrateado_usd: (this.dataEdit ? this.dataEdit.unit_value_prorrateado_usd : 0),
      subItemsToDelete: [[]],
      itemsTodelete: [[]],
      format_code: [''],
      code: [''],
      administrative_percentage: [this.calculationBase.administration_percentage.value],
      unforeseen_percentage: [this.calculationBase.unforeseen_percentage.value],
      utility_percentage: [this.calculationBase.utility_percentage.value],
    });
    this.forma.get('administrative_percentage').valueChanges.subscribe(value => {
      const items = this.forma.get('items') as FormArray
      items.controls.forEach((i: FormGroup) => {
        const subItems = i.controls.subItems as FormArray
        subItems.controls.forEach((sub: FormGroup) => {
          sub.patchValue({
            percentage_amd: value
          })
        })
      })
    })
    this.forma.get('unforeseen_percentage').valueChanges.subscribe(value => {
      const items = this.forma.get('items') as FormArray
      items.controls.forEach((i: FormGroup) => {
        const subItems = i.controls.subItems as FormArray
        subItems.controls.forEach((sub: FormGroup) => {
          sub.patchValue({
            percentage_unforeseen: value
          })
        })
      })
    })
    this.forma.get('utility_percentage').valueChanges.subscribe(value => {
      const items = this.forma.get('items') as FormArray
      items.controls.forEach((i: FormGroup) => {
        const subItems = i.controls.subItems as FormArray
        subItems.controls.forEach((sub: FormGroup) => {
          sub.patchValue({
            percentage_utility: value
          })
        })
      })
    })
  }

  indirectCostPush(indirect, all = true) {
    indirect.clear();
    this.indirectCosts.forEach((element) => {
      indirect.push(this.indirectCostgroup(element, this.fb, all));
    });
  }

  indirectCostgroup(el, fb: FormBuilder, all = true) {
    const optionals = all ? { percentage: [el.percentage], name: [el.text] } : {}

    let group = fb.group({
      indirect_cost_id: el.value,
      apply_service: el.apply_service,
      value: 0,
      ...optionals
    });

    if (all) {

      const items = this.forma.get('items') as FormArray
      group.get('percentage').valueChanges.subscribe(r => {

        /* Actualizar todos los subtotales de los elementos cuand cambia el porcetaje global */
        items.controls.forEach((i: FormGroup) => {
          const subItems = i.controls.subItems as FormArray
          subItems.controls.forEach((sub: FormGroup) => {
            const totalCost = sub.controls.type
            setTimeout(() => {
              totalCost.patchValue(totalCost.value)
            }, 500);
          })
        })
      })
    }
    /*  help.functionsApu.indirectCostOp(group, form); */
    return group;
  }

  async getCities() {
    await this._apuPieza.getCities().toPromise().then((r: any) => {
      this.cities = r.data;
    })
  }

  save() {
    this._swal.show({
      title: '¿Está seguro?',
      text: 'Se dispone a guardar un presupuesto',
      icon: 'question'
    }).then(async r => {
      if (r.isConfirmed) {
        await this.dataEdit && this.path != 'copiar' ? this.updateData() : this.saveData()
        this._swal.show({
          title: 'Se ha guardado con éxito',
          text: '',
          icon: 'success',
          showCancel: false
        })
        this.router.navigate(['crm/presupuesto'])
      }
    })
  }

  saveData = () => {
    const data = this.forma.value;
    this._budget.save({ data }).subscribe(r => { })
  }

  updateData = () => {
    const data = this.forma.value;
    this._budget.update(data, this.id).subscribe(r => { })
  }

  get total_cop() {
    return this.forma.get('total_cop').value
  }
  get total_usd() {
    return this.forma.get('total_usd').value
  }
  get unit_value_prorrateado_cop() {
    return this.forma.get('unit_value_prorrateado_cop').value
  }
  get unit_value_prorrateado_usd() {
    return this.forma.get('unit_value_prorrateado_usd').value
  }
  get indirecCostList() {
    return this.forma.get('indirect_costs') as FormArray;
  }

  get hasItems() {
    return this.forma.get('items').value.length
  }
}
