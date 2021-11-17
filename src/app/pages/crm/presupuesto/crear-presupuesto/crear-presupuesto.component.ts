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
            indirect_cost: false
          },
          subItems: this.fb.array([this.makeSubItem()]),
        }
      )
    );
    console.log(this.items);

  }

  changeView(group: FormGroup, key: string) {
    const shows = group.get('shows').value
    group.patchValue({ shows: { [key]: !shows[key] } })
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
      total_amd_imp_uti: 0,
      another_values: 0,
      percentage: 0,
      unit_value_cop: 0,
      unit_value_usd: 0,
      observation: '',
    })
    const cuantity = subItemGroup.get('cuantity')
    const unitCost = subItemGroup.get('unit_cost')
    const indirectCosts = subItemGroup.get('indirect_costs') as FormArray
    const type = subItemGroup.get('type')

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
      console.log({ set });


      const value = this.calculateSutIndirectos(indirectCosts, set)
      subItemGroup.patchValue({ subtotal_indirect_cost: value })

    })

    type.valueChanges.subscribe(r => {
      const set = r == 'P' ? subItemGroup.get('total_cost').value : 0
      const value = this.calculateSutIndirectos(indirectCosts, set)
      subItemGroup.patchValue({ subtotal_indirect_cost: value })
    })
    return subItemGroup
  }

  calculateSutIndirectos(indirect: FormArray, setValue: number) {
    let subTotal = 0
    indirect.controls.forEach((x, pos) => {
      if (setValue) {
        const indirectOriginal = this.forma.get('indirect_costs').value[pos];
        console.log(indirectOriginal);

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
        console.log(r);
        /* Actualizar todos los subtotales de los elementos cuand cambia el porcetaje global */
        items.controls.forEach((i: FormGroup) => {
          const subItems = i.controls.subItems as FormArray
          subItems.controls.forEach((sub: FormGroup) => {
            const totalCost = sub.controls.type
            console.log(totalCost);
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
