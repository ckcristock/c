import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DayBgRow } from '@fullcalendar/daygrid';
import { materiaHelper } from './materia-prima';
import { materialsHelper } from './materials';
import { cutWaterHelper } from './cut-water';
import { cutLaserHelper } from './cut-laser';
import { machineToolHelper } from './machine-tools';
import { internalProccessesHelper } from './internal_proccesses';
import { externalProccessesHelper } from './external_proccesses';
import { othersHelper } from './others';

export const functionsApu = {
  consts: {
    percentage_product: []
  },

  fillInForm(form: FormGroup, data, fb: FormBuilder, geometriesList: Array<any>, materials: Array<any>, cutLmaterials: Array<any>, commercialMaterials: Array<any>) {
    form.patchValue({
      name: data?.name,
      city_id: data?.city?.id,
      person_id: data?.person_id,
      third_party_id: data?.third_party_id,
      line: data?.line,
      amount: data?.amount,
      minute_value_laser: data?.minute_value_laser,
      minute_value_water: data?.minute_value_water,
      observation: data?.observation,
      direct_costs_indirect_costs_total: data?.direct_costs_indirect_costs_total,
      direct_costs_indirect_costs_unit: data?.direct_costs_indirect_costs_unit,
      administrative_percentage: data?.administrative_percentage,
      administrative_value: data?.administrative_value,
      unforeseen_percentage: data?.unforeseen_percentage,
      unforeseen_value: data?.unforeseen_value,
      administrative_unforeseen_subtotal: data?.administrative_unforeseen_subtotal,
      administrative_unforeseen_unit: data?.administrative_unforeseen_unit,
      utility_percentage: data?.utility_percentage,
      admin_unforeseen_utility_subtotal: data?.admin_unforeseen_utility_subtotal,
      admin_unforeseen_utility_unit: data?.admin_unforeseen_utility_unit,
      sale_price_cop_withholding_total: data?.sale_price_cop_withholding_total,
      sale_value_cop_unit: data?.sale_value_cop_unit,
      trm: data?.trm,
      sale_price_usd_withholding_total: data?.sale_price_usd_withholding_total,
      sale_value_usd_unit: data?.sale_value_usd_unit,
      others_subtotal: data?.others_subtotal,
      total_direct_cost: data?.total_direct_cost,
      unit_direct_cost: data?.unit_direct_cost,
      subtotal_raw_material: data?.subtotal_raw_material,
      commercial_materials_subtotal: data?.commercial_materials_subtotal,
      cut_water_total_amount: data?.cut_water_total_amount,
      cut_water_unit_subtotal: data?.cut_water_unit_subtotal,
      cut_water_subtotal: data?.cut_water_subtotal,
      cut_laser_total_amount: data?.cut_laser_total_amount,
      cut_laser_unit_subtotal: data?.cut_laser_unit_subtotal,
      cut_laser_subtotal: data?.cut_laser_subtotal,
      machine_tools_subtotal: data?.machine_tools_subtotal,
      internal_proccesses_subtotal: data?.internal_proccesses_subtotal,
      external_proccesses_subtotal: data?.external_proccesses_subtotal
    });
    materiaHelper.createFillInMateria(form, fb, data, geometriesList, commercialMaterials);
    materialsHelper.createFillInMaterials(form, fb, data);
    cutWaterHelper.createFillInCutWater(form, fb, data, materials);
    cutLaserHelper.createFillInCutLaser(form, fb, data, cutLmaterials);
    machineToolHelper.createFillInMachineTools(form, fb, data);
    internalProccessesHelper.createFillInInternal(form, fb, data);
    externalProccessesHelper.createFillInExternal(form, fb, data);
    othersHelper.createFillInOthers(form, fb, data);
    this.fillInIndirectCost(form, fb, data);
    this.subscribes(form)
  },

  fillInIndirectCost(form: FormGroup, fb: FormBuilder, data) {
    if (data?.indirect) {
      let indirect_cost = form.get('indirect_cost') as FormArray;
      data?.indirect?.forEach(element => {
        let group = fb.group({
          name: [element?.name],
          percentage: [element?.percentage],
          value: [element?.value]
        });
        this.indirectCostOp(group, form);
        indirect_cost.push(group);
      });
    }
  },

  createForm(fb: FormBuilder, calculationBase, user_id) {
    let group = fb.group({
      name: ['', Validators.required],
      city_id: [null, Validators.required],
      person_id: [user_id],
      third_party_id: [null, Validators.required],
      line: ['', Validators.required],
      minute_value_laser: [calculationBase?.laser_cut_minute_value?.value],
      minute_value_water: [calculationBase?.warer_cut_minute_value?.value],
      amount: [null, Validators.required],
      files: [''],
      observation: [''],
      materia_prima: fb.array([]),
      subtotal_raw_material: [0],
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
      direct_costs_indirect_costs_total: [0],
      direct_costs_indirect_costs_unit: [0],
      administrative_percentage: [calculationBase?.administration_percentage?.value],
      administrative_value: [0],
      unforeseen_percentage: [calculationBase?.unforeseen_percentage?.value],
      unforeseen_value: [0],
      administrative_unforeseen_subtotal: [0],
      administrative_unforeseen_unit: [0],
      utility_percentage: [calculationBase?.utility_percentage?.value],
      admin_unforeseen_utility_subtotal: [0],
      admin_unforeseen_utility_unit: [0],
      sale_price_cop_withholding_total: [0],
      sale_value_cop_unit: [0],
      trm: [calculationBase?.trm?.value],
      sale_price_usd_withholding_total: [0],
      sale_value_usd_unit: [0],
      format_code: [''],
      code: ['']
    });
    this.subscribes(group)
    return group;
  },

  cityRetention(group: FormGroup, cities: Array<any>) {
    group.get('city_id').valueChanges.subscribe(value => {
      let data = cities.find(c => c?.value == value);
      if (data) {
        let admin_unforeseen_utility_subtotal = group.get('admin_unforeseen_utility_subtotal');
        let result = admin_unforeseen_utility_subtotal?.value / (1 - (data?.percentage_product / 100));
        group.patchValue({
          sale_price_cop_withholding_total: Math.round(result)
        })
      }
    });
    group.get('admin_unforeseen_utility_subtotal').valueChanges.subscribe(value => {
      let city = group.get('city_id');
      let data = cities.find(c => c.value == city?.value);
      if (data) {
        let result = value / (1 - (data.percentage_product / 100));
        group.patchValue({
          sale_price_cop_withholding_total: Math.round(result)
        });
      }
    });
  },

  indirectCostOp(indirect: FormGroup, form: FormGroup) {
    let list = form.get('indirect_cost') as FormArray;
    indirect.get('percentage').valueChanges.subscribe(value => {
      let total_direct_cost = form.get('total_direct_cost');
      let result = ((value / 100) * total_direct_cost.value);
      indirect.patchValue({
        value: Math.round(result)
      });
    });
    form.get('total_direct_cost').valueChanges.subscribe(value => {
      let percentage = indirect.get('percentage');
      let result = ((percentage?.value / 100) * value);
      indirect.patchValue({
        value: Math.round(result)
      });
    });
    indirect.get('value').valueChanges.subscribe(value => {
      this.subtotalIndirectCost(list, form);
    });
  },

  subscribes(group: FormGroup) {
    group.get('indirect_cost_total').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost');
      group.patchValue({
        direct_costs_indirect_costs_total: total_direct_cost?.value + value
      });
    });

    group.get('minute_value_laser').valueChanges.subscribe(value => {
      let cut_laser = group.get('cut_laser') as FormArray;
      cut_laser?.controls.forEach(element => {
        element.patchValue({
          minute_value: value
        })
      });
    })

    group.get('minute_value_water').valueChanges.subscribe(value => {
      let cut_water = group.get('cut_water') as FormArray;
      cut_water?.controls.forEach(element => {
        element.patchValue({
          minute_value: value
        })
      });
    })

    group.get('total_direct_cost').valueChanges.subscribe(value => {
      let indirect_cost_total = group.get('indirect_cost_total');
      let administrative_percentage = group.get('administrative_percentage');
      let unforeseen_percentage = group.get('unforeseen_percentage');
      group.patchValue({
        direct_costs_indirect_costs_total: indirect_cost_total?.value + value,
        administrative_value: Math.round((value * (administrative_percentage?.value / 100))),
        unforeseen_value: Math.round((value * (unforeseen_percentage?.value / 100)))
      });
    });
    group.get('amount').valueChanges.subscribe(value => {
      let materia_prima = group.get('materia_prima') as FormArray;
      materia_prima?.controls.forEach(element => {
        element.patchValue({
          q: value
        })
      });
      let direct_costs_indirect_costs_total = group.get('direct_costs_indirect_costs_total');
      let administrative_unforeseen_subtotal = group.get('administrative_unforeseen_subtotal');
      let admin_unforeseen_utility_subtotal = group.get('admin_unforeseen_utility_subtotal');
      let sale_price_cop_withholding_total = group.get('sale_price_cop_withholding_total');
      let sale_price_usd_withholding_total = group.get('sale_price_usd_withholding_total');
      group.patchValue({
        direct_costs_indirect_costs_unit: direct_costs_indirect_costs_total?.value / value,
        administrative_unforeseen_unit: administrative_unforeseen_subtotal?.value / value,
        admin_unforeseen_utility_unit: admin_unforeseen_utility_subtotal?.value / value,
        sale_value_cop_unit: sale_price_cop_withholding_total?.value / value,
        sale_value_usd_unit: sale_price_usd_withholding_total?.value / value
      });
    });
    group.get('direct_costs_indirect_costs_total').valueChanges.subscribe(value => {
      let amount = group?.get('amount');
      group.patchValue({
        direct_costs_indirect_costs_unit: value / amount.value
      });
    });
    group.get('administrative_percentage').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost');
      group.patchValue({
        administrative_value: Math.round((total_direct_cost?.value * (value / 100)))
      });
    });
    group.get('unforeseen_percentage').valueChanges.subscribe(value => {
      let total_direct_cost = group.get('total_direct_cost');
      group.patchValue({
        unforeseen_value: Math.round(((value / 100) * total_direct_cost?.value))
      });
    });
    group.get('administrative_unforeseen_subtotal').valueChanges.subscribe(value => {
      let amount = group.get('amount');
      let utility_percentage = group.get('utility_percentage');
      let result = value / (1 - (utility_percentage?.value / 100))
      group.patchValue({
        administrative_unforeseen_unit: value / amount?.value,
        admin_unforeseen_utility_subtotal: Math.round(result)
      });
    });
    group.get('utility_percentage').valueChanges.subscribe(value => {
      let administrative_unforeseen_subtotal = group.get('administrative_unforeseen_subtotal');
      let result = (administrative_unforeseen_subtotal?.value / (1 - (value / 100)))
      group.patchValue({
        admin_unforeseen_utility_subtotal: Math.round(result)
      });
    });
    group.get('admin_unforeseen_utility_subtotal').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      group.patchValue({
        admin_unforeseen_utility_unit: value * amount
      });
    });
    group.get('sale_price_cop_withholding_total').valueChanges.subscribe(value => {
      let trm = group.get('trm').value;
      let amount = group.get('amount').value;
      group.patchValue({
        sale_price_usd_withholding_total: Math.round(value / trm),
        sale_value_cop_unit: Math.round(value / amount)
      })
    });
    group.get('trm').valueChanges.subscribe(value => {
      let sale_price_cop_withholding_total = group.get('sale_price_cop_withholding_total').value;
      group.patchValue({
        sale_price_usd_withholding_total: Math.round(sale_price_cop_withholding_total / value)
      })
    });
    group.get('sale_price_usd_withholding_total').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      group.patchValue({
        sale_value_usd_unit: Math.round(value / amount)
      });
    });
  },

  subtotalIndirectCost(list: FormArray, form: FormGroup) {
    setTimeout(() => {
      let total =
        list.value.reduce(
          (a, b) => {
            return a + b.value
          }, 0
        );
      form.patchValue({
        indirect_cost_total: total
      })
    }, 100);
  },

  sumarTotalDirectCost(form: FormGroup) {
    setTimeout(() => {
      let forma = form.value;
      let result =
        forma?.subtotal_raw_material +
        forma?.commercial_materials_subtotal +
        forma?.cut_water_subtotal +
        forma?.cut_laser_subtotal +
        forma?.machine_tools_subtotal +
        forma?.internal_proccesses_subtotal +
        forma?.external_proccesses_subtotal +
        forma?.others_subtotal;
      form.patchValue({
        total_direct_cost: result
      });
    }, 130);
  },

  directCostUnit(form: FormGroup) {
    setTimeout(() => {
      let forma = form.value;
      let result = (forma?.total_direct_cost / forma?.amount);
      form.patchValue({
        unit_direct_cost: result
      })
    }, 130);
  },

  listerTotalDirectCost(form: FormGroup): void {
    form.get('subtotal_raw_material').valueChanges.subscribe((r) => {
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
    form.get('direct_costs_indirect_costs_total').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
    form.get('unforeseen_value').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
    form.get('administrative_value').valueChanges.subscribe((r) => {
      this.sumarAmindImpr(form);
    });
  },

  sumarAmindImpr(form: FormGroup) {
    let forma = form.value;
    let resultAminImp =
      forma?.direct_costs_indirect_costs_total + forma?.administrative_value +
      forma?.unforeseen_value;
    form.patchValue({
      administrative_unforeseen_subtotal: resultAminImp
    })
  }
};
