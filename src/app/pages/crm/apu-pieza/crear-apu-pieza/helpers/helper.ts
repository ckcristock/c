import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DayBgRow } from '@fullcalendar/daygrid';
import { materiaHelper } from './materia-prima';

export const functionsApu = {
  consts: {},

  createForm(fb: FormBuilder, indirectCost:Array<any>) {
    let group = fb.group({
      name: [''],
      city_id: [''],
      person_id: [''],
      third_party_id:[''],
      line: [''],
      amount: [0],
      files: [''],
      observation: [''],
      materia_prima: fb.array([]),
      materia_prima_subtotal: [0],
      commercial_materials: fb.array([]),
      commercial_materials_subtotal: [0],
      cut_water: fb.array([]),
      cut_water_total_amount: [0],
      cut_water_unit_subtotal: [0],
      cut_water_subtotal: [0],
      cut_laser: fb.array([]),
      cut_laser_total_amount: [0],
      cut_laser_unit_subtotal: [0],
      cut_laser_subtotal: [0],
      machine_tools: fb.array([]),
      machine_tools_subtotal: [0],
      internal_proccesses: fb.array([]),
      internal_proccesses_subtotal: [0],
      external_proccesses: fb.array([]),
      external_proccesses_subtotal: [0],
      others: fb.array([]),
      others_subtotal: [0],
      total_direct_cost: [0],
      unit_direct_cost: [0],
      indirect_cost: fb.array([]),
      indirect_cost_total: [0],
      direct_Costs_Indirect_Costs_total: [0],
      direct_Costs_Indirect_Costs_unit: [0],
      administrative_percentage: [0],
      administrative_value: [0],
      unforeseen_percentage: [0],
      unforeseen_value: [0],
      administrative_Unforeseen_subTotal: [0],
      administrative_Unforeseen_unit: [0],
      utility_percentage: [0],
      admin_unforeseen_utility_subTotal: [0],
      admin_unforeseen_utility_unit: [0],
      sale_price_cop_withholding_total: [0],
      sale_value_cop_unit: [0],
      trm: [0],
      sale_price_usd_withholding_total: [0],
      sale_value_usd_unit: [0]
    });
    let indirect_cost = group.get('indirect_cost') as FormArray;
    indirect_cost.clear();
    indirectCost.forEach(element => {
      indirect_cost.push(this.indirectCostgroup(element, fb, group));
    });
    this.subscribes(group, indirect_cost)
    return group;
  },

  indirectCostgroup(element, fb: FormBuilder, form: FormGroup){
    let group = fb.group({
      name: [element.text],
      percentage: [element.percentage],
      value: [0]
    });
    this.indirectCostOp(group, form);
    return group;
  },

  indirectCostOp(indirect:FormGroup, form:FormGroup){
    let list = form.get('indirect_cost') as FormArray;
    indirect.get('percentage').valueChanges.subscribe(value => {
      let total_direct_cost = form.get('total_direct_cost').value;
      let result = value * total_direct_cost;
      indirect.patchValue({
        value: result
      });
    });
    form.get('total_direct_cost').valueChanges.subscribe(value => {
      let percentage = indirect.get('percentage').value;
      let result = percentage * value;
      indirect.patchValue({
        value: result
      });
    });
    indirect.get('value').valueChanges.subscribe(value => {
      this.subtotalIndirectCost(list, form);
    });
  },

  subscribes(group: FormGroup, list: FormArray){
    group.get('indirect_cost_total').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost').value;
      group.patchValue({
        direct_Costs_Indirect_Costs_total: total_direct_cost + value
      });
    });
    group.get('total_direct_cost').valueChanges.subscribe(value => {
      let indirect_cost_total = group.get('indirect_cost_total').value;
      let administrative_percentage = group.get('administrative_percentage').value;
      let unforeseen_percentage = group.get('unforeseen_percentage').value;
      group.patchValue({
        direct_Costs_Indirect_Costs_total: indirect_cost_total + value,
        administrative_value: value * administrative_percentage,
        unforeseen_value: value * unforeseen_percentage
      });
    });
    group.get('amount').valueChanges.subscribe(value => {
      let direct_Costs_Indirect_Costs_total = group.get('direct_Costs_Indirect_Costs_total').value;
      let administrative_Unforeseen_subTotal = group.get('administrative_Unforeseen_subTotal').value;
      let admin_unforeseen_utility_subTotal = group.get('admin_unforeseen_utility_subTotal').value;
      group.patchValue({
        direct_Costs_Indirect_Costs_unit: direct_Costs_Indirect_Costs_total / value,
        administrative_Unforeseen_unit: administrative_Unforeseen_subTotal / value,
        admin_unforeseen_utility_unit: admin_unforeseen_utility_subTotal / value
      });
    });
    group.get('direct_Costs_Indirect_Costs_total').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      group.patchValue({
        direct_Costs_Indirect_Costs_unit: value / amount
      });
    });
    group.get('administrative_percentage').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost').value;
      group.patchValue({
        administrative_value: total_direct_cost * value
      });
    });
    group.get('unforeseen_percentage').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost').value;
      group.patchValue({
        unforeseen_value: value * total_direct_cost
      });
    });
    group.get('administrative_Unforeseen_subTotal').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      let utility_percentage = group.get('utility_percentage').value;
      let result = parseFloat(value) / (100 - parseFloat(utility_percentage))
      group.patchValue({
        administrative_Unforeseen_unit: value / amount,
        admin_unforeseen_utility_subTotal: result
      });
    });
    group.get('utility_percentage').valueChanges.subscribe(value => {
      let administrative_Unforeseen_subTotal = group.get('administrative_Unforeseen_subTotal').value;
      let result = parseFloat(administrative_Unforeseen_subTotal) / (100 - parseFloat(value))
      group.patchValue({
        admin_unforeseen_utility_subTotal: result
      });
    });
    group.get('admin_unforeseen_utility_subTotal').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      group.patchValue({
        admin_unforeseen_utility_unit: value * amount
      });
    });
  },

  subtotalIndirectCost(list: FormArray, form:FormGroup){
    setTimeout(() => {
      let total =
      list.value.reduce(
        (a, b) => {
          return  a + b.value
        },0
      );
      form.patchValue({
        indirect_cost_total: total
      }) 
    }, 100);
  },

  sumarTotalDirectCost(form: FormGroup){
    setTimeout(() => {
      let forma = form.value;
      let result = 
      forma.materia_prima_subtotal + 
      forma.commercial_materials_subtotal +
      forma.cut_water_subtotal +
      forma.cut_laser_subtotal +
      forma.cut_laser_subtotal +
      forma.machine_tools_subtotal +
      forma.internal_proccesses_subtotal +
      forma.external_proccesses_subtotal +
      forma.others_subtotal;
      form.patchValue({
        total_direct_cost: result
      });
    }, 130);
  },

  directCostUnit(form: FormGroup){
    setTimeout(() => {
      let forma = form.value;
      let result = (forma.total_direct_cost / forma.amount);
      form.patchValue({
        unit_direct_cost: result
      })
    }, 130);
  },

  listerTotalDirectCost(form: FormGroup): void {
    form.get('materia_prima_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('commercial_materials_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('cut_water_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('cut_laser_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('machine_tools_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('internal_proccesses_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('external_proccesses_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('others_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('total_direct_cost').valueChanges.subscribe((r) => {
      this.directCostUnit(form);
    });
    form.get('amount').valueChanges.subscribe(value => {
      this.directCostUnit(form);
      form.patchValue({
        cut_water_total_amount: value,
        cut_laser_total_amount: value
      });
    });
    form.get('direct_Costs_Indirect_Costs_total').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
    form.get('unforeseen_value').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
    form.get('administrative_value').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
  },

  sumarAmindImpr(form:FormGroup){
    let forma = form.value;
    let resultAminImp = 
    forma.direct_Costs_Indirect_Costs_total + forma.administrative_value +
    forma.unforeseen_value;
    form.patchValue({
      administrative_Unforeseen_subTotal: resultAminImp
    })
  }
};
