export interface ApuConjunto {
  id: number;
  name: string;
  code: string;
  format_code: string;
  city_id: string;
  person_id: number;
  third_party_id: number;
  line: string;
  observation: string;
  list_pieces_sets_subtotal: number;
  machine_tools_subtotal: number;
  internal_processes_subtotal: number;
  external_processes_subtotal: number;
  others_subtotal: number;
  total_direct_cost: number;
  unit_direct_cost: null;
  indirect_cost_total: number;
  direct_costs_indirect_costs_total: number;
  administrative_percentage: number;
  administrative_value: number;
  unforeseen_percentage: number;
  unforeseen_value: number;
  administrative_unforeseen_subtotal: number;
  administrative_unforeseen_unit: number;
  utility_percentage: number;
  admin_unforeseen_utility_subtotal: number;
  sale_price_cop_withholding_total: number;
  trm: number;
  sale_price_usd_withholding_total: number;
  state: string;
  updated_at: Date;
  created_at: Date;
  typeapu_name: string;
  set_name: string;
  machine_name: string;
  city: City;
  files: File[];
  thirdparty: Thirdparty;
  machine: any[];
  setpartlist: Setpartlist[];
  internal: InternalElement[];
  external: any[];
  other: any[];
  indirect: Indirect[];
  person: Person;
}

export interface City {
  id: number;
  name: string;
  abbreviation: string;
  department_id: number;
  code: string;
  dian_code: number;
  dane_code: number;
  municipalities_id: number;
  percentage_product: number;
  percentage_service: number;
  state: string;
  created_at: null;
  updated_at: Date;
}

export interface File {
  id: number;
  file: string;
  apu_set_id: string;
  name: string;
  type: string;
}

export interface Indirect {
  id: number;
  apu_set_id: number;
  name: string;
  percentage: number;
  value: number;
  updated_at: Date;
  created_at: Date;
}

export interface InternalElement {
  id: number;
  apu_set_id: number;
  description: string;
  unit_id: string;
  amount: number;
  unit_cost: number;
  total: number;
  updated_at: Date;
  created_at: Date;
  internal: InternalInternal;
  unit: Unit;
}

export interface InternalInternal {
  id: number;
  name: string;
  unit_cost: number;
  unit_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Unit {
  id: number;
  name: string;
  unit: string;
}

export interface Person {
  id: number;
  name: string;
  passport_number: null;
  visa: null;
}

export interface Setpartlist {
  id: number;
  apu_set_id: number;
  apu_part_id: number;
  apu_set_child_id: number;
  apu_type: string;
  unit_id: number;
  amount: number;
  unit_cost: number;
  total: number;
  updated_at: Date;
  created_at: Date;
  unit: Unit;
  apuset: null;
  apupart: Apupart;
  apuset_th: null;
  apupart_th: ApupartTh;
}

export interface Apupart {
  id: number;
  code: string;
  name: string;
  city_id: string;
  person_id: number;
  user_id: number;
  third_party_id: number;
  line: string;
  minute_value_laser: number;
  minute_value_water: number;
  amount: number;
  observation: string;
  subtotal_raw_material: number;
  commercial_materials_subtotal: number;
  cut_water_total_amount: number;
  cut_water_unit_subtotal: number;
  cut_water_subtotal: number;
  cut_laser_total_amount: number;
  cut_laser_unit_subtotal: number;
  cut_laser_subtotal: number;
  machine_tools_subtotal: number;
  internal_proccesses_subtotal: number;
  external_proccesses_subtotal: number;
  others_subtotal: number;
  total_direct_cost: number;
  unit_direct_cost: number;
  indirect_cost_total: number;
  direct_costs_indirect_costs_total: number;
  direct_costs_indirect_costs_unit: number;
  administrative_percentage: number;
  administrative_value: number;
  unforeseen_percentage: number;
  unforeseen_value: number;
  administrative_Unforeseen_subTotal: number;
  administrative_Unforeseen_unit: number;
  utility_percentage: number;
  admin_unforeseen_utility_subTotal: number;
  admin_unforeseen_utility_unit: number;
  sale_price_cop_withholding_total: number;
  sale_value_cop_unit: number;
  trm: number;
  sale_price_usd_withholding_total: number;
  sale_value_usd_unit: number;
  updated_at: Date;
  created_at: Date;
  typeapu_name: string;
  format_code: string;
  set_name: string;
  machine_name: string;
}

export interface ApupartTh {
  id: number;
  name: string;
  text: string;
  unit_direct_cost: number;
  value: number;
}

export interface Thirdparty {
  id: number;
  name: string;
}
