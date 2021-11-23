import { Component, EventEmitter, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.scss'],
})
export class CrearPresupuestoComponent implements OnInit {
  indirectCosts: any = [];
  sendIndirectCost = new EventEmitter<any[]>()
  forma: FormGroup;
  data = '';
  cities:any[] = []

  constructor(private _apuPieza: ApuPiezaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.getIndirectCosts();
    this.getCustumers();
    this.getCities();
  }
  getIndirectCosts() {
    this._apuPieza.getIndirectCosts().subscribe((r: any) => {
      this.indirectCosts = r.data;

      if (!this.data) {
        this.sendIndirectCost.emit(r.data)
        this.indirectCostPush(this.indirecCostList);
      }

    });
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
      customer_id: '',
      destinity_id: '',
      line: '',
      trm: '',
      project: '',
      indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: 0,
      total_usd: 0,
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,


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
    console.log(this.forma.value);

  }
}
