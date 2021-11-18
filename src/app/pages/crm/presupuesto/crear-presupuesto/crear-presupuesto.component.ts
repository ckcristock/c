import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.scss'],
})
export class CrearPresupuestoComponent implements OnInit {
  indirectCosts: any = [];
  forma: FormGroup;
  data = '';
  types = [
    { name: 'P', value: 'P' },
    { name: 'S', value: 'S' },
  ];
  constructor(private _apuPieza: ApuPiezaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.getIndirectCosts();
  }
  getIndirectCosts() {
    this._apuPieza.getIndirectCosts().subscribe((r: any) => {
      this.indirectCosts = r.data;

      if (!this.data) {
        this.indirectCostPush(this.indirecCostList);
      }

    });
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
    });


  }

  get items() {
    return this.forma.get('items') as FormArray;
  }

  addItems() {
    this.items.push(
      this.fb.group(
        {
          total: 0,
          shows: {
            indirect_cost: false,
            sum_others: false,
            total_sale: false
          },
          subItems: this.fb.array([this.makeSubItem()]),
        }
      )
    );

  }

  changeView(group: FormGroup, key: string) {
    const shows = group.get('shows').value
    group.patchValue({ shows: { ...shows, [key]: !shows[key] } })
  }

  deleteSubItem(group: FormGroup, pos: number) {
    const subItems = group.get('subItems') as FormArray
    subItems.removeAt(pos)
  }
  deleteItem(pos) {
    this.items.removeAt(pos)
  }

  addSubItem(group: FormGroup) {
    const subItems = group.get('subItems') as FormArray
    subItems.push(this.makeSubItem())
  }

  makeSubItem() {
    const subItemGroup = this.fb.group({
      type: 'P',
      description: '',
      cuantity: 0,
      unit_cost: 0,
      total_cost: 0,
      indirect_costs: this.makeIndirectCost(),
      subtotal_indirect_cost: 0,
      percentage_amd: 13,
      percentage_unforeseen: 2,
      percentage_utility: 10,
      value_amd: 0,
      value_unforeseen: 0,
      value_utility: 0,
      total_amd_imp_uti: 0,
      another_values: 0,
      subTotal: 0,
      retention: 23,
      percentage_sale: 0,
      value_cop: 0,
      value_usd: 0,
      unit_value_cop: 0,
      unit_value_usd: 0,
      observation: '',
    })
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

    subItemGroup.get('total_cost').valueChanges.subscribe(r => {
      const val = typeof r == "number" ? r : 0
      const set = type.value == 'P' ? val : 0
      const value = this.calculateSutIndirectos(indirectCosts, set)
      subItemGroup.patchValue({ subtotal_indirect_cost: value })

    })

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

    totalCost.valueChanges.subscribe(r => {
      subItemGroup.patchValue(this.makeUpdateAmdImpUti({ r, perAmd, perUnforeseen, perUtility }))
    })

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
      subTotal.patchValue(this.updateSubtotal([r,  subtotalIndirectCost.value, totalAmdImpUti.value , another.value,]))
    })

    subtotalIndirectCost.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, totalAmdImpUti.value, another.value, totalCost.value, ]))
    })

    totalAmdImpUti.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, another.value, totalCost.value, subtotalIndirectCost.value]))
    })

    another.valueChanges.subscribe(r => {
      subTotal.patchValue(this.updateSubtotal([r, totalAmdImpUti.value, totalCost.value, subtotalIndirectCost.value]))
    })


    subTotal.valueChanges.subscribe(r=>{
      subItemGroup.patchValue(
        {
           value_cop: (r + retention.value ),
           value_usd: ( ( r + retention.value ) * trm.value  ),
           }
        )
    })

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
    this.indirectCostPush(indirectCosts, false)
    return indirectCosts
  }

  get indirecCostList() {
    return this.forma.get('indirect_costs') as FormArray;
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
}
