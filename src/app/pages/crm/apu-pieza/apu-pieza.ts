export interface ApuPart {
    status: boolean;
    code:   number;
    data:   Data;
    err:    null;
}

export interface Data {
    id:                                 number;
    name:                               string;
    code:                               string;
    format_code:                        string;
    city_id:                            string;
    person_id:                          number;
    user_id:                            number;
    third_party_id:                     number;
    line:                               string;
    amount:                             number;
    observation:                        string;
    subtotal_raw_material:              number;
    commercial_materials_subtotal:      number;
    cut_water_total_amount:             number;
    cut_water_unit_subtotal:            number;
    cut_water_subtotal:                 number;
    cut_laser_total_amount:             number;
    cut_laser_unit_subtotal:            number;
    cut_laser_subtotal:                 number;
    machine_tools_subtotal:             number;
    internal_proccesses_subtotal:       number;
    external_proccesses_subtotal:       number;
    others_subtotal:                    number;
    total_direct_cost:                  number;
    unit_direct_cost:                   number;
    indirect_cost_total:                number;
    direct_costs_indirect_costs_total:  number;
    direct_costs_indirect_costs_unit:   number;
    administrative_percentage:          number;
    administrative_value:               number;
    unforeseen_percentage:              number;
    unforeseen_value:                   number;
    administrative_unforeseen_subtotal: number;
    administrative_unforeseen_unit:     number;
    utility_percentage:                 number;
    admin_unforeseen_utility_subtotal:  number;
    admin_unforeseen_utility_unit:      number;
    sale_price_cop_withholding_total:   number;
    sale_value_cop_unit:                number;
    trm:                                number;
    sale_price_usd_withholding_total:   number;
    sale_value_usd_unit:                number;
    updated_at:                         Date;
    created_at:                         Date;
    city:                               City;
    files:                              any[];
    thirdparty:                         Thirdparty;
    indirect:                           Indirect[];
    machine:                            Commercial[];
    external:                           Commercial[];
    internal:                           Commercial[];
    other:                              Commercial[];
    cutwater:                           Cut[];
    cutlaser:                           Cut[];
    commercial:                         Commercial[];
    person:                             Person;
    rawmaterial:                        Rawmaterial[];
}

export interface City {
    id:         number;
    name:       string;
    country_id: string;
    state:      string;
}

export interface Commercial {
    id:           number;
    material_id?: string;
    apu_part_id:  number;
    unit_id:      string;
    q_unit:       number;
    q_total:      number;
    unit_cost:    number;
    total:        number;
    unit:         Unit;
    material?:    Material;
    description?: string;
}

export interface Material {
    id:         number;
    name:       string;
    unit:       string;
    unit_price: string;
    cut_water:  number;
    cut_laser:  number;
    type:       string;
}

export interface Unit {
    id:   number;
    name: string;
}

export interface Cut {
    id:                   number;
    material_id:          string;
    apu_part_id:          number;
    thickness:            number;
    sheets_amount?:       string;
    long:                 number;
    width:                number;
    total_length:         number;
    amount_holes?:        number;
    diameter:             number;
    total_hole_perimeter: number;
    time:                 number;
    minute_value:         number;
    value:                number;
    material:             Material;
    amount?:              string;
    amount_cut?:          number;
}

export interface Indirect {
    id:          number;
    name:        string;
    apu_part_id: number;
    percentage:  number;
    value:       number;
}

export interface Person {
    id:              number;
    first_name:      string;
    first_surname:   string;
    passport_number: null;
    visa:            null;
}

export interface Rawmaterial {
    id:           number;
    geometry_id:  string;
    apu_part_id:  number;
    material_id:  string;
    weight_kg:    number;
    q:            number;
    weight_total: number;
    value_kg:     number;
    total_value:  number;
    measures:     Measure[];
    material:     Material;
    geometry:     Geometry;
}

export interface Geometry {
    id:             number;
    name:           string;
    image:          string;
    weight_formula: string;
}

export interface Measure {
    id:                       number;
    name:                     string;
    measure:                  string;
    measure_id:               string;
    value:                    number;
    apu_part_raw_material_id: string;
    pivot:                    Pivot;
}

export interface Pivot {
    apu_part_raw_material_id: string;
    measure_id:               string;
}

export interface Thirdparty {
    id:                      number;
    nit:                     string;
    person_type:             string;
    third_party_type:        string;
    social_reason:           string;
    first_name:              string;
    second_name:             null;
    first_surname:           string;
    second_surname:          null;
    dian_address:            string;
    address_one:             string;
    address_two:             string;
    address_three:           string;
    address_four:            string;
    cod_dian_address:        string;
    tradename:               string;
    department_id:           number;
    municipality_id:         number;
    zone_id:                 number;
    landline:                string;
    cell_phone:              string;
    email:                   string;
    winning_list_id:         null;
    apply_iva:               null;
    contact_payments:        null;
    phone_payments:          null;
    email_payments:          null;
    regime:                  null;
    encourage_profit:        null;
    ciiu_code_id:            null;
    withholding_agent:       null;
    withholding_oninvoice:   null;
    reteica_type:            null;
    reteica_account_id:      null;
    retefuente_account_id:   null;
    g_contribut:             null;
    reteiva_account_id:      null;
    condition_payment:       null;
    assigned_space:          null;
    discount_prompt_payment: null;
    discount_days:           null;
    state:                   string;
    rut:                     string;
    image:                   string;
    nueva_fecha:             Date;
    nuevo_campo_prueba:      string;
}
