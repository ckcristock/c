import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, map } from 'rxjs/operators';
import { CalculationBasesService } from '../../../ajustes/configuracion/base-calculos/calculation-bases.service';
import { BudgetService } from '../budget.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.scss'],
})
export class CrearPresupuestoComponent implements OnInit {
  @Input('id') id;
  @Input('dataEdit') dataEdit;

  indirectCosts: any = [];
  clients: any = [];
  forma: FormGroup;
  data = '';
  cities: any[] = []
  calculationBase: any = {}
  loading = false;

  constructor(
    private _apuPieza: ApuPiezaService,
    private fb: FormBuilder,
    private _calculationBase: CalculationBasesService,
    private _budget: BudgetService,
    private _swal: SwalService,
    private router: Router) { }
  async ngOnInit() {
    this.loading = true;
    /*   this.getCustumers(); */
    this.getClients();

    /* if (this.dataEdit) {

      this.calculationBase = {
        trm: { value: this.dataEdit.trm },
        utility_percentage: { value: this.dataEdit.utility_percentage },
        unforeseen_percentage: { value: this.dataEdit.unforeseen_percentage },
        administration_percentage: { value: this.dataEdit.administration_percentage },
      }
    } else { */
    await this.getBases()
    /*   } */

    this.createForm();
    await this.getIndirectCosts();
    this.loading = false;
    this.getCities();


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
          { text: el.indirect_cost.name, value: el.indirect_cost_id, percentage: el.percentage }
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


  custumer$: Observable<any>;
  custumerLoading = false;
  custumerInput$ = new Subject<string>();
  minLengthTerm = 3;

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
      id: (this.dataEdit ? this.dataEdit.id : ''),
      customer_id: (this.dataEdit ? this.dataEdit.customer_id : ''),
      destinity_id: (this.dataEdit ? this.dataEdit.destinity_id : ''),
      line: (this.dataEdit ? this.dataEdit.line : ''),
      trm: this.calculationBase.trm.value,
      project: (this.dataEdit ? this.dataEdit.project : ''),
      indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: (this.dataEdit ? this.dataEdit.total_cop : ''),
      total_usd: (this.dataEdit ? this.dataEdit.total_usd : ''),
      unit_value_prorrateado_cop: (this.dataEdit ? this.dataEdit.unit_value_prorrateado_cop : ''),
      unit_value_prorrateado_usd: (this.dataEdit ? this.dataEdit.unit_value_prorrateado_usd : ''),
      subItemsToDelete: [[]],
      itemsTodelete: [[]]
    });
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
  getCities() {
    this._apuPieza.getCities().subscribe((r: any) => {
      this.cities = r.data;
    })
  }
  save() {
    this._swal.show({
      title: '¿Está seguro?',
      text: 'Se dispone a guardar un presupuesto',
      icon: 'question'
    },
      this.dataEdit ? this.updateData : this.saveData

    ).then(r => {
      if (r.isConfirmed) {
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
}
