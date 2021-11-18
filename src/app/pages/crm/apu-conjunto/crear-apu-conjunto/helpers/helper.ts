import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { machineToolHelper } from './machine-tools';
import { internalProcessesHelper } from './internal_proccesses';
import { externalProcessesHelper } from './external_proccesses';
import { othersHelper } from './others';
import { piecesSetsHelper } from './piecesSets';

export const functionsApuConjunto = {

  fillInForm(form: FormGroup, data, fb: FormBuilder, apuParts:Array<any>) {
    let indirect_cost = form.get('indirect_cost') as FormArray;
    form.patchValue({
      name: data.name,
      city_id: data.city.id,
      person_id: data.person_id,
      third_party_id: data.third_party_id,
      line: data.line,
      observation: data.observation,
      direct_costs_indirect_costs_total: data.direct_costs_indirect_costs_total,
      administrative_percentage: data.administrative_percentage,
      administrative_value: data.administrative_value,
      unforeseen_percentage: data.unforeseen_percentage,
      unforeseen_value: data.unforeseen_value,
      administrative_unforeseen_subtotal: data.administrative_unforeseen_subtotal,
      list_pieces_sets_subtotal: data.list_pieces_sets_subtotal,
      utility_percentage: data.utility_percentage,
      admin_unforeseen_utility_subtotal: data.admin_unforeseen_utility_subtotal,
      sale_price_cop_withholding_total: data.sale_price_cop_withholding_total,
      trm: data.trm,
      sale_price_usd_withholding_total: data.sale_price_usd_withholding_total,
      others_subtotal: data.others_subtotal,
      total_direct_cost: data.total_direct_cost,
      machine_tools_subtotal: data.machine_tools_subtotal,
      internal_processes_subtotal: data.internal_processes_subtotal,
      external_processes_subtotal: data.external_processes_subtotal
    });
    piecesSetsHelper.createFillInPiecesSets(form, fb, data, apuParts)
    machineToolHelper.createFillInMachineTools(form, fb, data);
    internalProcessesHelper.createFillInInternal(form, fb, data);
    externalProcessesHelper.createFillInExternal(form, fb, data);
    othersHelper.createFillInOthers(form, fb, data);
    this.fillInIndirectCost(form, fb, data);
    this.subscribes(form, indirect_cost)
  },

  fillInIndirectCost(form: FormGroup, fb: FormBuilder, data){
    if (data.indirect) {
      let indirect_cost = form.get('indirect_cost') as FormArray;
      console.log(data.indirect);
      data.indirect.forEach(element => {
        let group = fb.group({
          name: [element.name],
          percentage: [element.percentage],
          value: [element.value]
        });
        this.indirectCostOp(group, form);
        indirect_cost.push(group);
      });
    }
  },

  createForm(fb: FormBuilder) {
    let group = fb.group({
      name: [''],
      city_id: [''],
      person_id: [''],
      third_party_id:[''],
      line: [''],
      files: [''],
      observation: [''],
      list_pieces_sets: fb.array([]),
      list_pieces_sets_subtotal: [0],
      machine_tools: fb.array([]),
      machine_tools_subtotal: [0],
      internal_processes: fb.array([]),
      internal_processes_subtotal: [0],
      external_processes: fb.array([]),
      external_processes_subtotal: [0],
      others: fb.array([]),
      others_subtotal: [0],
      total_direct_cost: [0],
      indirect_cost: fb.array([]),
      indirect_cost_total: [0],
      direct_costs_indirect_costs_total: [0],
      administrative_percentage: [0],
      administrative_value: [0],
      unforeseen_percentage: [0],
      unforeseen_value: [0],
      administrative_unforeseen_subtotal: [0],
      administrative_unforeseen_unit: [0],
      utility_percentage: [0],
      admin_unforeseen_utility_subtotal: [0],
      sale_price_cop_withholding_total: [0],
      trm: [0],
      sale_price_usd_withholding_total: [0],
    });
    this.subscribes(group)
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
        direct_costs_indirect_costs_total: total_direct_cost + value
      });
    });
    group.get('total_direct_cost').valueChanges.subscribe(value => {
      let indirect_cost_total = group.get('indirect_cost_total').value;
      let administrative_percentage = group.get('administrative_percentage').value;
      let unforeseen_percentage = group.get('unforeseen_percentage').value;
      group.patchValue({
        direct_costs_indirect_costs_total: indirect_cost_total + value,
        administrative_value: value * administrative_percentage,
        unforeseen_value: value * unforeseen_percentage
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
        unforeseen_value: total_direct_cost * value
      });
    });
    group.get('administrative_unforeseen_subtotal').valueChanges.subscribe(value => {
      let utility_percentage = group.get('utility_percentage').value;
      let result = value / (100 - utility_percentage)
      group.patchValue({
        admin_unforeseen_utility_subtotal: result
      });
    });
    group.get('utility_percentage').valueChanges.subscribe(value => {
      let administrative_unforeseen_subtotal = group.get('administrative_unforeseen_subtotal').value;
      let result = administrative_unforeseen_subtotal / (100 - value)
      group.patchValue({
        admin_unforeseen_utility_subtotal: result
      });
    });
    group.get('sale_price_cop_withholding_total').valueChanges.subscribe(value => {
      let trm = group.get('trm').value;
      group.patchValue({
        sale_price_usd_withholding_total: value / trm,
      })
    });
    group.get('trm').valueChanges.subscribe(value => {
      let sale_price_cop_withholding_total = group.get('sale_price_cop_withholding_total').value;
      group.patchValue({
        sale_price_usd_withholding_total: sale_price_cop_withholding_total / value
      })
    });
    group.get('direct_costs_indirect_costs_total').valueChanges.subscribe(value => {
      let administrative_value = group.get('administrative_value').value;
      let unforeseen_value = group.get('unforeseen_value').value;
      group.patchValue({
        administrative_unforeseen_subtotal: administrative_value + unforeseen_value + value
      });
    })
    group.get('administrative_value').valueChanges.subscribe(value => {
      let direct_costs_indirect_costs_total = group.get('direct_costs_indirect_costs_total').value;
      let unforeseen_value = group.get('unforeseen_value').value;
      group.patchValue({
        administrative_unforeseen_subtotal: direct_costs_indirect_costs_total + unforeseen_value + value
      });
    });
    group.get('unforeseen_value').valueChanges.subscribe(value => {
      let direct_costs_indirect_costs_total = group.get('direct_costs_indirect_costs_total').value;
      let administrative_value = group.get('administrative_value').value;
      group.patchValue({
        administrative_unforeseen_subtotal: direct_costs_indirect_costs_total + administrative_value + value
      });
    })
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
      /* console.log(forma.list_pieces_sets_subtotal +
      forma.machine_tools_subtotal +
      forma.internal_proccesses_subtotal +
      forma.external_proccesses_subtotal +
      forma.others_subtotal); */
      
      let result = 
      parseFloat(forma.list_pieces_sets_subtotal) +
      parseFloat(forma.machine_tools_subtotal) +
      parseFloat(forma.internal_processes_subtotal) +
      parseFloat(forma.external_processes_subtotal) +
      parseFloat(forma.others_subtotal);      
      form.patchValue({
        total_direct_cost: result
      });
    }, 130);
  },

  listerTotalDirectCost(form: FormGroup): void {
    form.get('list_pieces_sets_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('machine_tools_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('internal_processes_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('external_processes_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('others_subtotal').valueChanges.subscribe((r) => {
      this.sumarTotalDirectCost(form);
    });
    form.get('total_direct_cost').valueChanges.subscribe((r) => {
      this.sumarDirectCostIndirectCost(form);
    });
  },

  sumarDirectCostIndirectCost(form:FormGroup){
    let forma = form.value;
    let result = 
    forma.indirect_cost_total + forma.total_direct_cost;
    form.patchValue({
      direct_costs_indirect_costs_total: result
    })
  }
};