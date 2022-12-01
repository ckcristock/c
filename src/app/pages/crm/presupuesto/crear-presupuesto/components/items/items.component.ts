import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { diffDates } from '@fullcalendar/core/util/misc';
import { concat, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { ApuPiezaService } from 'src/app/pages/crm/apu-pieza/apu-pieza.service';
import { ApuConjuntoService } from '../../../../apu-conjunto/apu-conjunto.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  subItemsToDelete: Array<number> = []
  itemsTodelete: Array<number> = []
  @Input('forma') forma: FormGroup
  @Input('indirectCosts') indirectCosts: EventEmitter<any>
  @Input('calculationBase') calculationBase: any
  @Input('dataEdit') dataEdit: any

  @ViewChild('apus') apus: any
  tempItem: FormGroup
  types = [
    { name: 'P', value: 'P' },
    { name: 'S', value: 'S' },
  ];
  /*  indirectCosts: any[] */

  constructor(private fb: FormBuilder,
    private _apuPieza: ApuPiezaService,
    private _apuSet: ApuConjuntoService

  ) { }
  ngOnInit(): void {

    this.fillData();

    /* this.loadApuParts()
     */

  }

  get items() {
    return this.forma.get('items') as FormArray;
  }

  fillData() {

    if (this.dataEdit) {
      this.dataEdit.items.forEach(item => {
        let itemGroup = this.addItems(item)
        /*  item.subitems.forEach(subItem =>{
           this.addSubItem(itemGroup)
         }) */
      });
    }
  }
  count = 0;
  addItems(itemToAdd = null) {
    this.count++
    let item = this.fb.group(
      {
        shows: {
          indirect_cost: false,
          sum_others: false,
          total_sale: false,
          prorrateo: false
        },
        subItems: this.fb.array([]),
        id: itemToAdd ? itemToAdd.id : '',
        name: itemToAdd ? itemToAdd.name : 'ITEM ' + this.count,
        total_cost: itemToAdd ? itemToAdd.total_cost : 0,
        subtotal_indirect_cost_dynamic: this.makeTotalIndirectCost(),
        subtotal_indirect_cost: itemToAdd ? itemToAdd.subtotal_indirect_cost : 0,
        value_amd: itemToAdd ? itemToAdd.value_amd : 0,
        value_unforeseen: itemToAdd ? itemToAdd.value_unforeseen : 0,
        value_utility: itemToAdd ? itemToAdd.value_utility : 0,
        total_amd_imp_uti: itemToAdd ? itemToAdd.total_amd_imp_uti : 0,
        another_values: itemToAdd ? itemToAdd.another_values : 0,
        subTotal: itemToAdd ? itemToAdd.subTotal : 0,
        retention: itemToAdd ? itemToAdd.retention : 0,
        percentage_sale: itemToAdd ? itemToAdd.percentage_sale : 0,
        value_cop: itemToAdd ? itemToAdd.value_cop : 0,
        value_usd: itemToAdd ? itemToAdd.value_usd : 0,
        value_prorrota_cop: 0,
        value_prorrota_usd: itemToAdd ? itemToAdd.value_prorrota_usd : 0,
        unit_value_prorrateado_cop: itemToAdd ? itemToAdd.unit_value_prorrateado_cop : 0,
        unit_value_prorrateado_usd: itemToAdd ? itemToAdd.unit_value_prorrateado_usd : 0,
      }
    )
    const value_cop = item.get('value_cop')
    const subItems = item.get('subItems') as FormArray

    value_cop.valueChanges.subscribe(r => {
      let total = 0;
      subItems.controls.forEach((subItem: FormControl) => {
        const percentage_sale =
          (subItem.get('value_cop').value * 100 / value_cop.value).toFixed(2)

        total += Number(percentage_sale)
        subItem.patchValue({ percentage_sale })
      })
      item.patchValue({ percentage_sale: Math.round(total) })
      this.updateTotals('value_cop', 'total_cop');

    })
    const valueProrrotaCop = item.get('value_prorrota_cop')
    const valueProrrotaUsd = item.get('value_prorrota_usd')

    const trm = this.forma.get('trm')

    valueProrrotaCop.valueChanges.subscribe(r => {
      subItems.controls.forEach((subItem: FormControl) => {
        const percentage = subItem.get('percentage_sale').value

        if (percentage > 0) {
          const value_prorrota_cop = (percentage / 100 * r)
          subItem.patchValue({ value_prorrota_cop })
        }
      })

    })
    valueProrrotaUsd.valueChanges.subscribe(r => {
      subItems.controls.forEach((subItem: FormControl) => {
        const percentage = subItem.get('percentage_sale').value
        let value_prorrota_usd = 0
        if (percentage > 0 && trm.value > 0) {
          value_prorrota_usd = (percentage / 100 * r)
        }
        subItem.patchValue({ value_prorrota_usd })
      })

    })

    item.get('unit_value_prorrateado_cop').valueChanges.subscribe(r => {
      this.updateTotals('unit_value_prorrateado_cop', 'unit_value_prorrateado_cop');
    })
    item.get('unit_value_prorrateado_usd').valueChanges.subscribe(r => {
      this.updateTotals('unit_value_prorrateado_usd', 'unit_value_prorrateado_usd');
    })


    trm.valueChanges.subscribe(r => {
      subItems.controls.forEach((subItem: FormControl) => {
        let value_usd = 0
        if (r > 0 && subItem.get('value_cop').value > 0) {
          const base = subItem.get('value_cop').value + subItem.get('retention').value
          value_usd = base / r
        }
        subItem.patchValue({ value_usd })
        this.updateSubTotals(subItem.parent as FormArray, ['value_usd'])
      })
    })

    this.items.push(item);
    if (itemToAdd) {
      const subItems = item.get('subItems') as FormArray
      itemToAdd.subitems.forEach(subi => {
        if (subi.type_module == 'apu_set') {
          subi.apu_id = subi.apu_set_id
        }
        if (subi.type_module == 'apu_part') {
          subi.apu_id = subi.apu_part_id
        }
        if (subi.type_module == 'apu_service') {
          subi.apu_id = subi.service_id
        }
        subItems.push(this.makeSubItem(subi, true))
      });

    }
    return item
  }




  changeView(group: FormGroup, key: string) {
    const shows = group.get('shows').value
    group.patchValue({ shows: { ...shows, [key]: !shows[key] } })
  }

  deleteSubItem(group: FormGroup, pos: number) {
    const subItems = group.get('subItems') as FormArray

    const id = subItems.at(pos).get('id').value;
    id ? this.subItemsToDelete.push(id) : ''

    this.forma.patchValue({ subItemsToDelete: this.subItemsToDelete })
    subItems.removeAt(pos)
    this.updateSubTotals(subItems,
      ['total_cost', 'subtotal_indirect_cost', 'total_amd_imp_uti',
        'value_amd', 'value_unforeseen', 'value_utility',
        'subTotal', 'another_values', 'retention',
        'value_cop', 'value_usd'])

    this.recalculateTotals()
  }
  deleteItem(pos) {
    const id = this.items.at(pos).get('id').value;
    id ? this.itemsTodelete.push(id) : ''
    this.forma.patchValue({ itemsTodelete: this.itemsTodelete })

    this.items.removeAt(pos)
    this.recalculateTotals()
  }

  recalculateTotals() {
    this.updateTotals('unit_value_prorrateado_cop', 'unit_value_prorrateado_cop')
    this.updateTotals('unit_value_prorrateado_usd', 'unit_value_prorrateado_usd')
    this.updateTotals('value_cop', 'value_cop')
    this.updateTotals('value_usd', 'total_usd')
  }

  addSubItem(group: FormGroup) {
    const subItems = group.get('subItems') as FormArray
    subItems.push(this.makeSubItem())
  }

  select(group: FormGroup, key, toUpdate) {

    let control = group.get(key).value
    if (typeof control == 'object') {

      group.patchValue({ [toUpdate]: control['value'] })

    } else {
      group.patchValue({ [toUpdate]: '' })
    }
    /*     group.patchValue({ [key]: e.target.value }) */
    /*  return e.preventDefault() */

    group.patchValue({ 'unit_cost': control.unit_direct_cost })

  }

  findApus(item: FormGroup) {
    this.tempItem = item;
    //this.apus.show()
    this.apus.openConfirm()
  }
  getApus(e: any[]) {

    let subItems = this.tempItem.get('subItems') as FormArray

    e.forEach(apu => {
      const exist = subItems.value.some(x => (x.apu_id == apu.apu_id && x.type_module == apu.type_module))
      !exist ? subItems.push(this.makeSubItem(apu)) : ''
    });

  }

  makeSubItemGroup(apu, edit = false) {
    const percentages = {
      percentage_amd: edit ? apu.percentage_amd : this.calculationBase.administration_percentage.value,
      percentage_unforeseen: edit ? apu.percentage_unforeseen : this.calculationBase.unforeseen_percentage.value,
      percentage_utility: edit ? apu.percentage_utility : this.calculationBase.utility_percentage.value,
    }
    let description = ''
    if (edit) {
      description = apu.type_module ? apu[apu.type_module]['name'] : apu['description']
    } else {
      description = (apu ? apu.name : '')
    }

    return this.fb.group({
      id: ((edit && apu?.id) ? apu.id : ''),
      type: (apu ? apu.type : 'P'),
      description,
      apu_id: [(apu ? apu.apu_id : ''), Validators.required],
      cuantity: edit ? apu.cuantity : 0,
      unit_cost: (apu ? apu.unit_cost : ''),
      total_cost: edit ? apu.total_cost : 0,
      indirect_costs: this.makeIndirectCost(),
      subtotal_indirect_cost: edit ? apu.subtotal_indirect_cost : 0,
      ...percentages,
      value_amd: edit ? apu.value_amd : 0,
      value_unforeseen: edit ? apu.value_unforeseen : 0,
      value_utility: edit ? apu.value_utility : 0,
      total_amd_imp_uti: edit ? apu.total_amd_imp_uti : 0,
      another_values: edit ? apu.another_values : 0,
      subTotal: edit ? apu.subTotal : 0,
      retention: 23,
      percentage_sale: edit ? apu.percentage_sale : 0,
      value_cop: edit ? apu.value_cop : 0,
      value_usd: edit ? apu.value_usd : 0,
      unit_value_cop: edit ? apu.unit_value_cop : 0,
      unit_value_usd: edit ? apu.unit_value_usd : 0,
      value_prorrota_cop: edit ? apu.value_prorrota_cop : 0,
      value_prorrota_usd: edit ? apu.value_prorrota_usd : 0,
      unit_value_prorrateado_cop: edit ? apu.unit_value_prorrateado_cop : 0,
      unit_value_prorrateado_usd: edit ? apu.unit_value_prorrateado_usd : 0,
      observation: '',
      type_module: (apu ? apu.type_module : '')
    })
  }

  makeSubItem(apu = null, edit = false) {

    const subItemGroup = this.makeSubItemGroup(apu, edit)

    const cuantity = subItemGroup.get('cuantity')
    const unitCost = subItemGroup.get('unit_cost')
    const indirectCosts = subItemGroup.get('indirect_costs') as FormArray
    const type = subItemGroup.get('type')
    const totalCost = subItemGroup.get('total_cost')

    const suma = (a, b) => parseFloat(a) * parseFloat(b);

    cuantity.valueChanges.subscribe(r => {
      const value = (typeof r == "number" && typeof unitCost.value == "number") ? suma(r, unitCost.value) : 0
      subItemGroup.patchValue({ total_cost: value })
    })

    unitCost.valueChanges.subscribe(r => {
      const value = (typeof r == "number" && typeof cuantity.value == "number") ? suma(r, cuantity.value) : 0
      subItemGroup.patchValue({ total_cost: value })
    })

    totalCost.valueChanges.subscribe(r => {
      const val = typeof r == "number" ? r : 0
      const set = type.value == 'P' ? val : 0
      const value = this.calculateSutIndirectos(indirectCosts, set)
      subItemGroup.patchValue({ subtotal_indirect_cost: value })

      this.updateSubTotals(subItemGroup.parent as FormArray, ['total_cost'])

    })
    const partId = subItemGroup.get('apu_part_id')
    const serviceId = subItemGroup.get('service_id')
    type.valueChanges.subscribe(r => {
      const set = r == 'P' ? subItemGroup.get('total_cost').value : 0

      const value = this.calculateSutIndirectos(indirectCosts, set)
      subItemGroup.patchValue({ subtotal_indirect_cost: value })
    })


    const perAmd = subItemGroup.get('percentage_amd')
    const perUnforeseen = subItemGroup.get('percentage_unforeseen')
    const perUtility = subItemGroup.get('percentage_utility')

    const valueAmd = subItemGroup.get('value_amd')
    const valueUnforeseen = subItemGroup.get('value_unforeseen')
    const valueUtility = subItemGroup.get('value_utility')

    /* totalCost.valueChanges.subscribe(r => {

    }) */

    perAmd.valueChanges.subscribe(r => {
      const percentage_amd = typeof r == 'number' ? r : 0
      const value_amd = (percentage_amd * totalCost.value)
      let total_amd_imp_uti = value_amd + valueUtility.value + valueUnforeseen.value

      subItemGroup.patchValue({ value_amd, total_amd_imp_uti })
    })

    perUnforeseen.valueChanges.subscribe(r => {
      const percentage_unforeseen = typeof r == 'number' ? r : 0
      const value_unforeseen = (percentage_unforeseen * totalCost.value)
      let total_amd_imp_uti = value_unforeseen + valueUtility.value + valueAmd.value

      subItemGroup.patchValue({ value_unforeseen, total_amd_imp_uti })
    })

    perUtility.valueChanges.subscribe(r => {
      const percentage_utility = typeof r == 'number' ? r : 0
      const value_utility = (percentage_utility * totalCost.value)
      let total_amd_imp_uti = value_utility + valueUnforeseen.value + valueAmd.value

      subItemGroup.patchValue({ value_utility, total_amd_imp_uti })
    })

    const totalAmdImpUti = subItemGroup.get('total_amd_imp_uti')
    const subtotalIndirectCost = subItemGroup.get('subtotal_indirect_cost')
    const another = subItemGroup.get('another_values')
    const subTotal = subItemGroup.get('subTotal')
    const retention = subItemGroup.get('retention')
    const valueCop = subItemGroup.get('value_cop')
    const valueUsd = subItemGroup.get('value_usd')

    const trm = this.forma.get('trm')

    totalCost.valueChanges.subscribe(r => {
      subItemGroup.patchValue(this.makeUpdateAmdImpUti({ r, perAmd, perUnforeseen, perUtility }))
      subTotal.patchValue(this.updateSubtotal([r, subtotalIndirectCost.value, totalAmdImpUti.value, another.value,]))
    })

    subtotalIndirectCost.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, totalAmdImpUti.value, another.value, totalCost.value,]))
      this.updateSubTotals(subItemGroup.parent as FormArray, ['subtotal_indirect_cost'])

    })

    totalAmdImpUti.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, another.value, totalCost.value, subtotalIndirectCost.value]))
      this.updateSubTotals(subItemGroup.parent as FormArray, ['total_amd_imp_uti', 'value_amd', 'value_unforeseen', 'value_utility'])
    })

    another.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, totalAmdImpUti.value, totalCost.value, subtotalIndirectCost.value]))
      this.updateSubTotals(subItemGroup.parent as FormArray, ['another_values'])

    })

    subTotal.valueChanges.subscribe(r => {
      const base = r + retention.value
      subItemGroup.patchValue(
        {
          value_cop: base,
          value_usd: (trm.value ? base / trm.value : 0),
        }
      )
      this.updateSubTotals(subItemGroup.parent as FormArray, ['subTotal', 'retention', 'value_cop', 'value_usd'])
    })

    const percentageSale = subItemGroup.get('percentage_sale')

    percentageSale.valueChanges.subscribe(r => {
      let prorrota = subItemGroup.parent.parent.get('value_prorrota_cop').value
      let prorrota_usd = subItemGroup.parent.parent.get('value_prorrota_usd').value

      let value_prorrota_cop = 0
      let value_prorrota_usd = 0
      if (prorrota && r > 0) {
        value_prorrota_cop = ((r / 100) * prorrota)

        if (trm.value > 0) {
          value_prorrota_usd = ((r / 100) * prorrota_usd)
        }
      }

      subItemGroup.patchValue({ value_prorrota_cop, value_prorrota_usd })
    })
    /*  unit_value_prorrateado_cop: 0,
          unit_value_prorrateado_usd: 0, */
    const valueProrrotaUsd = subItemGroup.get('value_prorrota_usd')
    const valueProrrotaCop = subItemGroup.get('value_prorrota_cop')

    valueProrrotaCop.valueChanges.subscribe(r => {
      const unit_value_prorrateado_cop = r + valueCop.value
      subItemGroup.patchValue({ unit_value_prorrateado_cop })
      this.updateSubTotals(subItemGroup.parent as FormArray, ['unit_value_prorrateado_cop'])
    })
    valueProrrotaUsd.valueChanges.subscribe(r => {
      const unit_value_prorrateado_usd = r + valueUsd.value
      subItemGroup.patchValue({ unit_value_prorrateado_usd })
      this.updateSubTotals(subItemGroup.parent as FormArray, ['unit_value_prorrateado_usd'])
    })
    subItemGroup.get('value_cop').valueChanges.subscribe(r => {
      let unit_value_prorrateado_cop = valueProrrotaCop.value ? r + valueProrrotaCop.value : r

      subItemGroup.patchValue({ unit_value_prorrateado_cop })
      this.updateSubTotals(subItemGroup.parent as FormArray, ['unit_value_prorrateado_cop'])
    })
    subItemGroup.get('value_usd').valueChanges.subscribe(r => {
      let unit_value_prorrateado_usd = valueProrrotaUsd.value ? r + valueProrrotaUsd.value : r
      subItemGroup.patchValue({ unit_value_prorrateado_usd })
      this.updateSubTotals(subItemGroup.parent as FormArray, ['unit_value_prorrateado_usd'])
      this.updateTotals('value_usd', 'total_usd');

    })

    /*   const percentage = subItem.get('percentage_sale').value
        let value_prorrota_usd = 0
        if (percentage > 0 && trm.value >0) {
          value_prorrota_usd = (percentage / 100 * r) * trm.value
        } */

    /* TODO retencion se modifica? */
    /* retention.valueChanges.subscribe(r=>{
      valueCop.patchValue( r + subTotal.value )
      subItemGroup.patchValue(
        {
           value_cop: (r + subTotal.value ),
           valueUsd: ( ( r + subTotal.value ) * trm.value  ),
           }
        )
    }) */

    return subItemGroup
  }

  updateTotals(keyBase, keytoUpdate) {
    let total_key = 0
    this.items.controls.forEach(x => {
      const subItems = x.get('subItems').value
      subItems.forEach(sub => {
        total_key += sub[keyBase]
      });
    })
    this.forma.patchValue({ [keytoUpdate]: total_key })
  }



  updateSubTotals(itemGroup: FormArray, keysToUpdate: Array<string>) {
    const subItems = itemGroup.value;

    keysToUpdate.forEach(keyToUpdate => {
      const total: number = subItems.reduce((acc, el) => acc + el[keyToUpdate], 0);
      const parent: FormGroup = itemGroup.parent as FormGroup
      parent.patchValue({ [keyToUpdate]: total })
    });

  }
  updateSubtotal(values: Array<number>) {
    return values.reduce((acc, el) => acc + el, 0)
  }

  makeUpdateAmdImpUti({ r, perAmd, perUnforeseen, perUtility }) {
    let toUpdate = {}
    let sum = 0

    const perAmdValue = perAmd.value
    const perUtilityValue = perUtility.value
    const perUnforeseenValue = perUnforeseen.value

    if (typeof r == 'number') {

      if (typeof perUnforeseenValue == 'number') {
        const value_unforeseen = (r * perUnforeseenValue)
        toUpdate = { ...toUpdate, value_unforeseen }
        sum += value_unforeseen
      }

      if (typeof perAmdValue == 'number') {
        const value_amd = (r * perAmdValue)
        toUpdate = { ...toUpdate, value_amd }
        sum += value_amd
      }

      if (typeof perUtilityValue == 'number') {
        const value_utility = (r * perUtilityValue)
        toUpdate = { ...toUpdate, value_utility }
        sum += value_utility
      }

    }
    return { ...toUpdate, total_amd_imp_uti: sum }
  }

  calculateSutIndirectos(indirect: FormArray, setValue: number) {
    let subTotal = 0
    indirect.controls.forEach((x, pos) => {
      if (setValue) {
        const indirectOriginal = this.forma.get('indirect_costs').value[pos];
        const value = (indirectOriginal.percentage * setValue)
        subTotal += value;
        x.patchValue({ value })
      } else {
        x.patchValue({ value: 0 })
      }
    })
    return subTotal;
  }

  makeIndirectCost(): FormArray {
    const indirectCosts = this.fb.array([])
    this.indirectCosts.forEach((element) => {
      indirectCosts.push(this.indirectCostgroup(element, this.fb));
    });
    /*  this.indirectCostPush(indirectCosts) */
    return indirectCosts
  }

  indirectCostgroup(el, fb: FormBuilder) {
    const group = fb.group({
      indirect_cost_id: el.value,
      value: 0,
    });
    const id = el.value
    group.get('value').valueChanges.subscribe(r => {
      setTimeout(() => {
        const subItems = group.parent.parent.parent as FormArray
        const item = subItems.parent
        const indirectTotals = item.get('subtotal_indirect_cost_dynamic') as FormArray

        let total = 0
        subItems.controls.forEach(subItem => {
          const indirectCosts: Array<any> = subItem.get('indirect_costs').value
          total += indirectCosts.find(x => x.indirect_cost_id == id).value
        });


        const toUpdate = indirectTotals.controls.find(r => r.get('indirect_cost_id').value == id);
        toUpdate.patchValue({ sub_total: total })
      }, 300);
    })
    return group
  }

  makeTotalIndirectCost(): FormArray {
    const totals = this.fb.array([])
    this.indirectCosts.forEach((el) => {
      totals.push(this.fb.group({
        indirect_cost_id: el.value,
        sub_total: 0
      }));
    });
    return totals
  }

  model: any
  searching = false;
  searchFailed = false;
  /*  */
  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(name =>
      this._apuSet.findApuParts({ name }).pipe(
        map((r: any) => r.data),
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }))

    ),
    tap(() => this.searching = false)
  )

  formatter = (x: { text: string }) => x.text;
  inputFormatBandListValue(value: any) {
    if (value.code)
      return value.code
    return value;
  }


  /*  */
  apuPart$: Observable<any>;
  apuPartLoading = false;
  apuPartInput$ = new Subject<string>();
  minLengthTerm = 3;
  loadApuParts() {
    this.apuPart$ = concat(
      of([]), // default items
      this.apuPartInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.apuPartLoading = true),
        switchMap(term => {
          let param = { name: term }
          return this._apuPieza.getApuPart(param).pipe(
            map((r: any) => { return r.data }),
            catchError(() => of([])), // empty list on error
            tap(() => this.apuPartLoading = false)
          )
        })
      )
    );
  }
}
