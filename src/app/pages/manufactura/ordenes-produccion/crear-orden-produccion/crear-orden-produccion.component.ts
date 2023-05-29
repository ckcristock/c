import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { MunicipiosService } from 'src/app/pages/ajustes/configuracion/departamentos-municipios/municipios/municipios.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';
import { groupBy, map, mergeMap, reduce, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-crear-orden-produccion',
  templateUrl: './crear-orden-produccion.component.html',
  styleUrls: ['./crear-orden-produccion.component.scss']
})
export class CrearOrdenProduccionComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  work_order;
  id: number;
  action: any;
  thirds: any[] = [];
  third_people: any[] = [];
  last_id: number;
  today = new Date();
  cities: any[] = [];
  datosCabecera = {
    Titulo: 'Nueva orden de producción',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: ''
  }
  filterPart = { type_multiple: 'pieza' };
  filterSet = { type_multiple: 'conjunto' };
  filterService = { type_multiple: 'servicio' };
  constructor(
    private fb: FormBuilder,
    private _third_party: TercerosService,
    private _work_order: OrdenesProduccionService,
    private _city: MunicipiosService,
    public _texteditor: Texteditor2Service,
    private _swal: SwalService,
    public router: Router,
    public _consecutivos: ConsecutivosService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.action = this.route.snapshot.url[1].path;
    })
    this.createForm();
    this.getData();
    this.getThirdPerson()
    if (this.id) {
      this.getWorkOrder(this.id)
    }
  }

  getData() {
    this.loading = true;
    this.getConsecutivo();
    this._third_party.getClient().subscribe((res: any) => {
      this.thirds = res.data
    })
    this._city.getAllMunicipalities().subscribe((res: any) => {
      this.cities = res.data
      this.loading = false
    })
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('work_orders').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      if (this.action != 'editar') {
        this.buildConsecutivo(this.form.get('municipality_id')?.value, r)
        this.form.get('municipality_id')?.valueChanges.subscribe(value => {
          this.buildConsecutivo(value, r)
        });
      }
    })
  }

  buildConsecutivo(value, r, context = '') {
    if (r.data.city) {
      let city = this.cities?.find(x => x?.value === value)
      if (city && !city?.abbreviation) {
        this.form.get('municipality_id')?.setValue(null);
        this._swal.show({
          icon: 'error',
          title: 'Error',
          text: 'El destino no tiene abreviatura.',
          showCancel: false
        })
      } else {
        let con = this._consecutivos.construirConsecutivo(r?.data, city?.abbreviation, context);
        this.datosCabecera.Codigo = con
        this.form.patchValue({
          code: con
        })
      }
    } else {
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con
      this.form.patchValue({
        code: con
      })
    }
  }

  getWorkOrder(id) {
    this.loading = true
    this._work_order.getWorkOrder(id).pipe(
      map((res: any) => {
        const elements = res.data.elements;
        const groupedElements = elements.reduce((acc: any, curr: any) => {
          const key = curr.work_orderable_type.replace(/[\\/\.]/g, '_');
          if (acc[key]) {
            acc[key].push(curr);
          } else {
            acc[key] = [curr];
          }
          return acc;
        }, {});
        return { ...res, data: { ...res.data, elements: groupedElements } };
      })
    ).subscribe((res: any) => {
      console.log(res)
      this.work_order = res.data;
      this.loading = false
      this.form.patchValue({
        id: this.action == 'editar' ? res.data.id : '',
        purchase_order: this.work_order.purchase_order,
        name: this.work_order.name,
        type: this.work_order.type,
        third_party_id: this.work_order.third_party_id,
        expected_delivery_date: this.work_order.expected_delivery_date,
        municipality_id: this.work_order.municipality_id,
        observations: this.work_order.observations,
        third_party_person_id: this.work_order.third_party_person_id,
        description: this.work_order.description,
        technical_requirements: this.work_order.technical_requirements,
        legal_requirements: this.work_order.legal_requirements,
        date: this.action == 'editar' ? this.work_order.date : new Date(),
      });
      this.newBudget(this.work_order?.elements?.App_Models_Budget, true);
      this.newQuotation(this.work_order?.elements?.App_Models_Quotation, true);
      this.newBusiness(this.work_order?.elements?.App_Models_Business, true);
      this.newApuPart(this.work_order?.elements?.App_Models_ApuPart, true);
      this.newApuSet(this.work_order?.elements?.App_Models_ApuSet, true);
      this.newApuService(this.work_order?.elements?.App_Models_ApuService, true);
      if (this.action == 'editar') {
        this.form.patchValue({
          code: this.work_order.code
        })
        this.datosCabecera.Codigo = this.work_order.code
      }
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      code: ['', [Validators.required, Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.maxLength(250)]],
      purchase_order: ['', [Validators.required, Validators.maxLength(250)]],
      class: ['Repuesto', Validators.required],
      type: ['V', Validators.required],
      expected_delivery_date: ['', Validators.required],
      third_party_id: [null, Validators.required],
      municipality_id: [null, Validators.required],
      third_party_person_id: [null, Validators.required],
      observations: ['', Validators.maxLength(65535)],
      format_code: ['', Validators.maxLength(250)],
      description: ['', Validators.maxLength(4294967295)],
      technical_requirements: ['', Validators.maxLength(4294967295)],
      legal_requirements: ['', Validators.maxLength(4294967295)],
      budgets: this.fb.array([]),
      quotations: this.fb.array([]),
      business: this.fb.array([]),
      apu_parts: this.fb.array([]),
      apu_sets: this.fb.array([]),
      apu_services: this.fb.array([]),
    });
    const classFormControl = this.form.get('class');
    classFormControl.valueChanges.subscribe(value => {
      if (value == 'Interna') {
        this.form.controls.third_party_id.disable();
        this.form.controls.third_party_person_id.disable();
      } else {
        this.form.controls.third_party_id.enable();
        this.form.controls.third_party_person_id.enable();
      }
    })
  }

  getThirdPerson() {
    this._third_party.getThirdPartyPersonIndex().subscribe((res: any) => {
      this.third_people = res.data
    })
  }

  get budgets() {
    return this.form.get('budgets') as FormArray;
  }

  get quotations() {
    return this.form.get('quotations') as FormArray;
  }

  get business() {
    return this.form.get('business') as FormArray;
  }

  get apu_parts() {
    return this.form.get('apu_parts') as FormArray;
  }
  get apu_sets() {
    return this.form.get('apu_sets') as FormArray;
  }
  get apu_services() {
    return this.form.get('apu_services') as FormArray;
  }

  newBudget(budgets, alter = false) {
    budgets.forEach(budget => {
      const budget_intern = alter ? budget.work_orderable : budget;
      this.budgets.push(this.fb.group({
        id: [budget_intern.id],
        code: [budget_intern.code],
        total_cop: [budget_intern.total_cop],
      }))
    });
  }

  newQuotation(quotations, alter = false) {
    quotations.forEach(quotation => {
      const quotation_intern = alter ? quotation.work_orderable : quotation;
      this.quotations.push(this.fb.group({
        id: [quotation_intern.id],
        code: [quotation_intern.code],
        total_cop: [quotation_intern.total_cop],
      }))
    });
  }

  newBusiness(business, alter = false) {
    business.forEach(business => {
      const business_intern = alter ? business.work_orderable : business;
      this.business.push(this.fb.group({
        id: [business_intern.id],
        code: [business_intern.code],
        total_cop: [business_intern.total_cop],
      }))
    });
  }

  newApuPart(apu_parts, alter = false) {
    apu_parts.forEach(apu_part => {
      const apu_part_intern = alter ? apu_part.work_orderable : apu_part;
      this.apu_parts.push(this.fb.group({
        id: [apu_part_intern.apu_id],
        code: [apu_part_intern.code],
        total_cop: [apu_part_intern.total_cop],
      }))
    });
  }

  newApuSet(apu_sets, alter = false) {
    apu_sets.forEach(apu_set => {
      const apu_set_intern = alter ? apu_set.work_orderable : apu_set;
      this.apu_sets.push(this.fb.group({
        id: [apu_set_intern.apu_id],
        code: [apu_set_intern.code],
        total_cop: [apu_set_intern.total_cop],
      }))
    });
  }

  newApuService(apu_services, alter = false) {
    apu_services.forEach(apu_service => {
      const apu_service_intern = alter ? apu_service.work_orderable : apu_service;
      this.apu_services.push(this.fb.group({
        id: [apu_service_intern.apu_id],
        code: [apu_service_intern.code],
        total_cop: [apu_service_intern.total_cop],
      }))
    });
  }

  deleteBudget(i) {
    this.budgets.removeAt(i)
  }

  deleteQuotation(i) {
    this.quotations.removeAt(i)
  }

  deleteBusiness(i) {
    this.business.removeAt(i)
  }

  deleteApuPart(i) {
    this.apu_parts.removeAt(i)
  }

  deleteApuSet(i) {
    this.apu_sets.removeAt(i)
  }

  deleteApuService(i) {
    this.apu_services.removeAt(i)
  }

  save() {
    console.log(this.form.value)
    if (this.form.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar esta orden de producción.'
      }).then(res => {
        if (res.isConfirmed) {
          this._work_order.saveWorkOrder(this.form.value).subscribe(r => {
            this._swal.show({
              icon: 'success',
              title: 'Correcto',
              text: 'Hemos guardado la orden de producción correctamente.',
              showCancel: false,
              timer: 100
            })
            this.router.navigate(['/manufactura/ordenes-produccion'])
          })
        }
      })
    } else {
      this._swal.incompleteError();
    }

  }
}
