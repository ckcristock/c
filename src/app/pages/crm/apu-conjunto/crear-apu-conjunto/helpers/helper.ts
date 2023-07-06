import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { machineToolHelper } from './machine-tools';
import { internalProcessesHelper } from './internal_proccesses';
import { externalProcessesHelper } from './external_proccesses';
import { othersHelper } from './others';
import { piecesSetsHelper } from './piecesSets';

export const functionsApuConjunto = {
  consts: {
    retefuente_percentage: []
  },

  fillInForm(form: FormGroup, data, fb: FormBuilder, apuParts: Array<any>) {
    form?.patchValue({
      name: data?.name,
      city_id: data?.city?.id,
      person_id: data?.person_id,
      third_party_id: data?.third_party_id,
      line: data?.line,
      observation: data?.observation,
      direct_costs_indirect_costs_total: data?.direct_costs_indirect_costs_total,
      administrative_percentage: data?.administrative_percentage,
      administrative_value: data?.administrative_value,
      unforeseen_percentage: data?.unforeseen_percentage,
      unforeseen_value: data?.unforeseen_value,
      administrative_unforeseen_subtotal: data?.administrative_unforeseen_subtotal,
      list_pieces_sets_subtotal: data?.list_pieces_sets_subtotal,
      utility_percentage: data?.utility_percentage,
      admin_unforeseen_utility_subtotal: data?.admin_unforeseen_utility_subtotal,
      sale_price_cop_withholding_total: data?.sale_price_cop_withholding_total,
      trm: data?.trm,
      sale_price_usd_withholding_total: data?.sale_price_usd_withholding_total,
      others_subtotal: data?.others_subtotal,
      total_direct_cost: data?.total_direct_cost,
      machine_tools_subtotal: data?.machine_tools_subtotal,
      internal_processes_subtotal: data?.internal_processes_subtotal,
      external_processes_subtotal: data?.external_processes_subtotal,
      set_name: data?.set_name,
      machine_name: data?.machine_name
    });
    piecesSetsHelper?.createFillInPiecesSets(form, fb, data)
    machineToolHelper?.createFillInMachineTools(form, fb, data);
    internalProcessesHelper?.createFillInInternal(form, fb, data);
    externalProcessesHelper?.createFillInExternal(form, fb, data);
    othersHelper?.createFillInOthers(form, fb, data);
    this?.fillInIndirectCost(form, fb, data);
    this?.subscribes(form)
  },

  fillInIndirectCost(form: FormGroup, fb: FormBuilder, data) {
    if (data?.indirect) {
      let indirect_cost = form?.get('indirect_cost') as FormArray;
      data?.indirect?.forEach(element => {
        let group = fb?.group({
          name: [element?.name],
          percentage: [element?.percentage],
          value: [element?.value]
        });
        this?.indirectCostOp(group, form);
        indirect_cost?.push(group);
      });
    }
  },

  createForm(fb: FormBuilder, user_id, calculationBase) {
    let group = fb?.group({
      name: ['', [Validators?.required, Validators.maxLength(191)]],
      city_id: [null, Validators?.required],
      person_id: [user_id],
      third_party_id: [null, Validators?.required],
      line: ['', [Validators?.required, Validators.maxLength(191)]],
      files: [''],
      observation: ['', Validators.maxLength(65535)],
      list_pieces_sets: fb?.array([]),
      list_pieces_sets_subtotal: [0],
      machine_tools: fb?.array([]),
      machine_tools_subtotal: [0],
      internal_processes: fb?.array([]),
      internal_processes_subtotal: [0],
      external_processes: fb?.array([]),
      external_processes_subtotal: [0],
      others: fb?.array([]),
      others_subtotal: [0],
      total_direct_cost: [0],
      indirect_cost: fb?.array([]),
      indirect_cost_total: [0],
      direct_costs_indirect_costs_total: [0],
      administrative_percentage: [calculationBase?.administration_percentage?.value],
      administrative_value: [0],
      unforeseen_percentage: [calculationBase?.unforeseen_percentage?.value],
      unforeseen_value: [0],
      administrative_unforeseen_subtotal: [0],
      administrative_unforeseen_unit: [0],
      utility_percentage: [calculationBase?.utility_percentage?.value],
      admin_unforeseen_utility_subtotal: [0],
      sale_price_cop_withholding_total: [0],
      trm: [calculationBase?.trm?.value],
      sale_price_usd_withholding_total: [0],
      format_code: [''],
      code: [''],
      set_name: ['', Validators?.maxLength(255)],
      machine_name: ['', Validators?.maxLength(255)]
    });
    this?.subscribes(group)
    return group;
  },

  indirectCostOp(indirect: FormGroup, form: FormGroup) {
    let list = form?.get('indirect_cost') as FormArray;
    indirect?.get('percentage')?.valueChanges?.subscribe(value => {
      let total_direct_cost = form?.get('total_direct_cost');
      let result = ((value / 100) * total_direct_cost?.value);
      indirect?.patchValue({
        value: Math?.round(result)
      });
    });
    form?.get('total_direct_cost')?.valueChanges?.subscribe(value => {
      let percentage = indirect?.get('percentage');
      let result = ((percentage?.value / 100) * value);
      indirect?.patchValue({
        value: Math?.round(result)
      });
    });
    indirect?.get('value')?.valueChanges?.subscribe(value => {
      this?.subtotalIndirectCost(list, form);
    });
  },

  cityRetention(group: FormGroup, cities: Array<any>) {
    group?.get('city_id')?.valueChanges?.subscribe(value => {
      let data = cities?.find(c => c?.value == value);
      if (data) {
        let admin_unforeseen_utility_subtotal = group?.get('admin_unforeseen_utility_subtotal');
        let result = (typeof admin_unforeseen_utility_subtotal?.value == 'number' && typeof data?.percentage_product == 'number'
          ?
          admin_unforeseen_utility_subtotal?.value / (1 - (data?.percentage_product / 100))
          :
          0);
        group?.patchValue({ sale_price_cop_withholding_total: Math?.round(result) })
      }
    });
    group?.get('admin_unforeseen_utility_subtotal')?.valueChanges?.subscribe(value => {
      let city = group?.get('city_id');
      let data = cities?.find(c => c?.value == city?.value);
      if (data) {
        let result = (typeof data?.percentage_product == 'number'
          &&
          typeof value == 'number' ? value / (1 - (data?.percentage_product / 100)) : 0);
        group?.patchValue({
          sale_price_cop_withholding_total: Math?.round(result)
        });
      }
    });
  },

  subscribes(group: FormGroup, clients: Array<any>) {
    group?.get('indirect_cost_total')?.valueChanges?.subscribe(value => {
      let total_direct_cost = group?.get('total_direct_cost');
      let result = (typeof total_direct_cost?.value == 'number' && typeof value == 'number' ? (total_direct_cost?.value + value) : 0)
      group?.patchValue({ direct_costs_indirect_costs_total: result });
    });
    group?.get('total_direct_cost')?.valueChanges?.subscribe(value => {
      let indirect_cost_total = group?.get('indirect_cost_total');
      let administrative_percentage = group?.get('administrative_percentage');
      let unforeseen_percentage = group?.get('unforeseen_percentage');
      let administrativeResult = (typeof administrative_percentage?.value == 'number' && typeof value == 'number' ? (value * (administrative_percentage?.value / 100)) : 0)
      let unforeseenResult = (typeof value == 'number' && typeof unforeseen_percentage?.value == 'number' ? (value * (unforeseen_percentage?.value / 100)) : 0)
      group?.patchValue({
        direct_costs_indirect_costs_total: (typeof indirect_cost_total?.value == 'number' && typeof value == 'number' ? (indirect_cost_total?.value + value) : 0),
        administrative_value: Math?.round(administrativeResult),
        unforeseen_value: Math?.round(unforeseenResult)
      });
    });
    group?.get('administrative_percentage')?.valueChanges?.subscribe(value => {
      let total_direct_cost = group?.get('total_direct_cost');
      let result = (typeof total_direct_cost?.value == 'number' && typeof value == 'number' ? (total_direct_cost?.value * (value / 100)) : 0)
      group?.patchValue({
        administrative_value: Math?.round(result)
      });
    });
    group?.get('unforeseen_percentage')?.valueChanges?.subscribe(value => {
      let total_direct_cost = group?.get('total_direct_cost');
      let result = (typeof total_direct_cost?.value == 'number' && typeof value == 'number' ? (total_direct_cost?.value * (value / 100)) : 0)
      group?.patchValue({
        unforeseen_value: Math?.round(result)
      });
    });
    group?.get('administrative_unforeseen_subtotal')?.valueChanges?.subscribe(value => {
      let utility_percentage = group?.get('utility_percentage');
      let result = (typeof value == 'number' && utility_percentage?.value ? (value / (1 - (utility_percentage?.value / 100))) : 0)
      group?.patchValue({
        admin_unforeseen_utility_subtotal: Math?.round(result)
      });
    });
    group?.get('utility_percentage')?.valueChanges?.subscribe(value => {
      let administrative_unforeseen_subtotal = group?.get('administrative_unforeseen_subtotal');
      let result = (typeof administrative_unforeseen_subtotal?.value == 'number' && typeof value == 'number' ? (administrative_unforeseen_subtotal?.value / (1 - (value / 100))) : 0)
      group?.patchValue({
        admin_unforeseen_utility_subtotal: Math?.round(result)
      });
    });
    group?.get('sale_price_cop_withholding_total')?.valueChanges?.subscribe(value => {
      let trm = group?.get('trm');
      let result = (typeof value == 'number' && typeof trm?.value == 'number' ? (value / trm?.value) : 0)
      group?.patchValue({ sale_price_usd_withholding_total: result.toFixed(2) })
    });
    group?.get('trm')?.valueChanges?.subscribe(value => {
      let sale_price_cop_withholding_total = group?.get('sale_price_cop_withholding_total');
      let result = (typeof sale_price_cop_withholding_total?.value == 'number' && typeof value == 'number' ? (sale_price_cop_withholding_total?.value / value) : 0)
      group?.patchValue({ sale_price_usd_withholding_total: result.toFixed(2) })
    });
    group?.get('direct_costs_indirect_costs_total')?.valueChanges?.subscribe(value => {
      let administrative_value = group?.get('administrative_value');
      let unforeseen_value = group?.get('unforeseen_value');
      group?.patchValue({
        administrative_unforeseen_subtotal: administrative_value?.value + unforeseen_value?.value + value
      });
    })
    group?.get('administrative_value')?.valueChanges?.subscribe(value => {
      let direct_costs_indirect_costs_total = group?.get('direct_costs_indirect_costs_total');
      let unforeseen_value = group?.get('unforeseen_value');
      let result = (typeof direct_costs_indirect_costs_total?.value == 'number'
        &&
        typeof unforeseen_value?.value == 'number'
        &&
        typeof value == 'number' ?
        (direct_costs_indirect_costs_total?.value + unforeseen_value?.value + value) :
        0)
      group?.patchValue({ administrative_unforeseen_subtotal: result });
    });
    group?.get('unforeseen_value')?.valueChanges?.subscribe(value => {
      let direct_costs_indirect_costs_total = group?.get('direct_costs_indirect_costs_total');
      let administrative_value = group?.get('administrative_value');
      let result = (typeof direct_costs_indirect_costs_total?.value == 'number'
        &&
        typeof administrative_value?.value == 'number'
        && typeof value == 'number' ? (direct_costs_indirect_costs_total?.value + administrative_value?.value + value)
        : 0)
      group?.patchValue({ administrative_unforeseen_subtotal: result });
    });
  },

  subtotalIndirectCost(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list?.value?.reduce(
          (a, b) => {
            return a + b?.value
          }, 0
        );
      form?.patchValue({
        indirect_cost_total: total
      })
    }, 100);
  },

  sumarTotalDirectCost(form: FormGroup) {
    setTimeout(() => {
      let forma = form?.value;
      let result =
        parseFloat(forma?.list_pieces_sets_subtotal) +
        parseFloat(forma?.machine_tools_subtotal) +
        parseFloat(forma?.internal_processes_subtotal) +
        parseFloat(forma?.external_processes_subtotal) +
        parseFloat(forma?.others_subtotal);
      form?.patchValue({
        total_direct_cost: result
      });
    }, 130);
  },

  listerTotalDirectCost(form: FormGroup): void {
    form?.get('list_pieces_sets_subtotal')?.valueChanges?.subscribe((r) => {
      this?.sumarTotalDirectCost(form);
    });
    form?.get('machine_tools_subtotal')?.valueChanges?.subscribe((r) => {
      this?.sumarTotalDirectCost(form);
    });
    form?.get('internal_processes_subtotal')?.valueChanges?.subscribe((r) => {
      this?.sumarTotalDirectCost(form);
    });
    form?.get('external_processes_subtotal')?.valueChanges?.subscribe((r) => {
      this?.sumarTotalDirectCost(form);
    });
    form?.get('others_subtotal')?.valueChanges?.subscribe((r) => {
      this?.sumarTotalDirectCost(form);
    });
    form?.get('total_direct_cost')?.valueChanges?.subscribe((r) => {
      this?.sumarDirectCostIndirectCost(form);
    });
  },

  sumarDirectCostIndirectCost(form: FormGroup) {
    let forma = form?.value;
    let result =
      forma?.indirect_cost_total + forma?.total_direct_cost;
    form?.patchValue({
      direct_costs_indirect_costs_total: result
    })
  }
};
