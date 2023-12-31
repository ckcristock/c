import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ApuPiezaService } from '../apu-pieza.service';
import { UnidadesMedidasService } from '../../../ajustes/parametros/apu/unidades-medidas/unidades-medidas.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as help from './helpers/imports';
import { materiaHelper } from './helpers/materia-prima';
import { cutWaterHelper } from './helpers/cut-water';
import { materialsHelper } from './helpers/materials';
import { cutLaserHelper } from './helpers/cut-laser';
import { internalProccessesHelper } from './helpers/internal_proccesses';
import { machineToolHelper } from './helpers/machine-tools';
import { externalProccessesHelper } from './helpers/external_proccesses';
import { othersHelper } from './helpers/others';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculationBasesService } from '../../../ajustes/configuracion/base-calculos/calculation-bases.service';
import { ProcesosExternosService } from 'src/app/pages/ajustes/parametros/apu/procesos-externos/procesos-externos.service';
import { ProcesosInternosService } from 'src/app/pages/ajustes/parametros/apu/procesos-internos/procesos-internos.service';
import { MaquinasHerramientasService } from 'src/app/pages/ajustes/parametros/apu/maquinas-herramientas/maquinas-herramientas.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { consts } from 'src/app/core/utils/consts';
import {
  ViewportScroller
} from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { MaterialesService } from 'src/app/pages/ajustes/parametros/apu/materiales/materiales.service';
import { MaterialesMateriaPrimaService } from 'src/app/pages/ajustes/parametros/apu/materiales-materia-prima/materiales-materia-prima.service';
@Component({
  selector: 'app-crear-apu-pieza',
  templateUrl: './crear-apu-pieza.component.html',
  styleUrls: ['./crear-apu-pieza.component.scss']
})
export class CrearApuPiezaComponent implements OnInit {
  @Input('id') id;
  @Input('data') data;
  @Input('title') title = 'Crear pieza';
  @Input('preData') preData = undefined;
  @Output() obtenerDato = new EventEmitter;
  @Output() saveForAddToSet = new EventEmitter;
  pageYoffset = 0;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window?.pageYOffset;
  }
  form: FormGroup;
  date: Date = new Date();
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  people: any[] = [];
  cities: any[] = [];
  geometries: any[] = [];
  procesos_internos: any[] = [];
  procesos_externos: any[] = [];
  maquinas_herramientas: any[] = [];
  materials: any[] = [];
  clients: any[] = [];
  units: any[] = [];
  indirectCosts: any[] = [];
  thicknesses: any[] = [];
  files: File[] = [];
  fileString: any = '';
  file = '';
  fileArr: any[] = [];
  cutLaserMaterials: any[] = [];
  commercialMaterials: any[] = [];
  materialsIndex: any[] = [];
  otherCollapsed: boolean;
  indirectCollapsed: boolean;
  auiCollapsed: boolean;
  loading: boolean = true;
  user_id;
  calculationBase: any = {}
  masksMoney = consts
  reload: boolean;
  constructor(
    private _apuPieza: ApuPiezaService,
    private _units: UnidadesMedidasService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private _calculationBase: CalculationBasesService,
    private _externos: ProcesosExternosService,
    private _internos: ProcesosInternosService,
    public _consecutivos: ConsecutivosService,
    private _rawMaterialMaterials: MaterialesMateriaPrimaService,
    private _maquinas: MaquinasHerramientasService,
    private _materials: MaterialesService,
    private scroll: ViewportScroller,
    private _user: UserService
  ) {
    this.user_id = _user?.user?.person?.id
  }
  selectedOption: string = '';

  async ngOnInit() {
    this.datosCabecera.Fecha = this.id ? this.data?.created_at : new Date();
    this.datosCabecera.Titulo = this.title;
    await this.getBases()
    this.createForm();
    this.getClients();
    this.getUnits();
    this.getGeometries();
    this.getMaterials();
    this.getIndirectCosts();
    this.getPeople();
    await this.getCities();
    this.collapses();
    this.getThicknesses();
    this.getCommercialMaterials();
    this.getMaterialsFull();
    await this.getCutLaserMaterial();
    this.validateData();
    this.getConsecutivo();
    await this.getVariablesApu();
    if (this.preData) {
      this.form?.patchValue({
        city_id: this.preData?.city_id,
        third_party_id: this.preData?.third_party_id,
        line: this.preData?.line,
      })
    }
    this.loading = false;
  }

  async reloadData() {
    this.reload = true;
    await this.getBases()
    this.getClients();
    this.getUnits();
    this.getGeometries();
    this.getMaterials();
    this.getIndirectCosts();
    this.getPeople();
    await this.getCities();
    this.getThicknesses();
    this.getCommercialMaterials();
    this.getMaterialsFull();
    await this.getCutLaserMaterial();
    this.getConsecutivo();
    await this.getVariablesApu();
    this.reload = false
  }

  getMaterialsFull(event: any = '') {
    let params = {
      limit: true,
      name: event.term ?? ''
    }
    this._materials.getMaterialsIndex(params).subscribe((res: any) => {
      this.materialsIndex = res.data;
    })
  }

  getCommercialMaterials(event: any = '') {
    let params = {
      limit: true,
      name: event.term ?? ''
    }
    this._rawMaterialMaterials.getRawMaterialMaterialsIndex(params).subscribe((res: any) => {
      this.commercialMaterials = res?.data
    })
  }

  collapses() {
    if (!this.data) {
      return null
    }
    (this.data && this.data?.other && this.data?.other?.length < 0 ? this.otherCollapsed = false : this.otherCollapsed = true);
  }
  getConsecutivo() {
    this._consecutivos.getConsecutivo('apu_parts').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r?.data?.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      if (this.title !== 'Editar pieza') {
        this.buildConsecutivo(this.form.get('city_id')?.value, r)
        this.form.get('city_id')?.valueChanges.subscribe(value => {
          this.buildConsecutivo(value, r)
        });
      } else {
        this.datosCabecera.Codigo = this.data?.code
        this.form.patchValue({
          code: this.data?.code
        })
        this.form.get('city_id')?.disable()
      }
    })
  }

  buildConsecutivo(value, r, context = '') {
    if (r.data.city) {
      let city = this.cities?.find(x => x?.value === value)
      if (city && !city?.abbreviation) {
        this.form.get('city_id')?.setValue(null);
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

  async getVariablesApu() {
    await this._externos.getExternos().toPromise().then((res: any) => {
      this.procesos_externos = res?.data
    })
    await this._maquinas.getMaquinas().toPromise().then((res: any) => {
      this.maquinas_herramientas = res?.data
    })
    await this._internos.getExternos().toPromise().then((res: any) => {
      this.procesos_internos = res?.data
    })
  }

  async getBases() {
    await this._calculationBase.getAll().toPromise().then((r: any) => {
      this.calculationBase = r?.data?.reduce((acc, el) => ({ ...acc, [el?.concept]: el }), {})
      /* if (this.dataEdit) {
        this.calculationBase.trm.value = this.dataEdit.trm
      } */
    })
  }

  onSelect(event) {
    const types = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']
    event?.addedFiles?.forEach(file => {
      if (!types?.includes(file?.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
    })

    this.files?.push(...event?.addedFiles);
  }

  onRemove(event) {
    this.files?.splice(this.files?.indexOf(event), 1);
  }

  getPeople() {
    this._apuPieza.getPeopleXSelect().subscribe((r: any) => {
      this.people = r?.data;
    })
  }

  async getCities() {
    await this._apuPieza.getCities().toPromise().then((r: any) => {
      this.cities = r?.data;
      help.functionsApu?.cityRetention(this.form, this.cities);
    })
  }


  getClients() {
    this._apuPieza.getClient().subscribe((r: any) => {
      this.clients = r?.data;
    });
  }

  getGeometries(event: any = '') {
    let params = {
      limit: true,
      name: event.term ?? ''
    }
    this._apuPieza.getGeometries(params).subscribe((r: any) => {
      this.geometries = r?.data;
    })
  }
  async getCutLaserMaterial(event: any = '') {
    let params = {
      limit: true,
      name: event.term ?? ''
    }
    await this._apuPieza.cutLaserMaterial(params).toPromise().then((r: any) => {
      this.cutLaserMaterials = r?.data;
    })
  }

  getMaterials(event: any = '') {
    let params = {
      limit: true,
      name: event.term ?? ''
    }
    this._apuPieza.getMaterials(params).subscribe((r: any) => {
      this.materials = r?.data;
    })
  }

  getUnits() {
    this._units.selectUnits().subscribe((r: any) => {
      this.units = r?.data;
    })
  }

  getThicknesses() {
    this._apuPieza.getThicknesses().subscribe((r: any) => {
      this.thicknesses = r?.data;
    })
  }

  getIndirectCosts() {
    this._apuPieza.getIndirectCosts().subscribe((r: any) => {
      this.indirectCosts = r?.data;
      if (!this.data) {
        this.indirectCostPush();
      }
    })
  }

  createForm() {
    this.form = help.functionsApu.createForm(this.fb, this.calculationBase, this.user_id);
    help.functionsApu?.listerTotalDirectCost(this.form);
  }
  planos: any[] = [];

  validateData() {
    if (this.data) {
      help.functionsApu.fillInForm(this.form, this.data, this.fb, this.geometries, this.materials, this.cutLaserMaterials, this.commercialMaterials);
      this.planos = this.data?.files
    }
  }

  async refreshData() {
    this.obtenerDato.emit();
    this.ngOnInit();
  }
  /************** Materia Prima Inicio ****************/
  basicControl(): FormGroup {
    let group = help.materiaHelper.createMateriaGroup(this.form, this.fb, this.geometries, this.commercialMaterials);
    return group;
  }

  get materiaList() {
    return this.form?.get('materia_prima') as FormArray;
  }

  newMateria() {
    if (this.form?.valid) {
      let materia = this.materiaList;
      materia?.push(this.basicControl())
    } else {
      this.form?.markAllAsTouched();
      this.scroll?.scrollToPosition([0, 0]);
    }
  }

  deleteMateria(i) {
    this.materiaList?.removeAt(i);
    materiaHelper?.subtotalMateria(this.materiaList, this.form);
  }
  /************** Materia Prima Fin ****************/

  /************** Materiales Comerciales Inicia ****************/
  materialsControl(): FormGroup {
    let group = help.materialsHelper.createMaterialsGroup(this.form, this.fb);
    return group;
  }

  get materialsList() {
    return this.form.get('commercial_materials') as FormArray;
  }

  newMaterial() {
    if (this.form.valid) {
      let materials = this.materialsList;
      materials.push(this.materialsControl())
    } else {
      this.form.markAllAsTouched();
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  deleteMaterial(i) {
    this.materialsList.removeAt(i);
    materialsHelper.subtotalMaterials(this.materialsList, this.form);
  }

  /************** Materiales Comerciales Fin ****************/

  /************** Corte de Agua Inicia ****************/

  cutWaterControl(): FormGroup {
    let group = help.cutWaterHelper.createCutWaterGroup(this.form, this.fb, this.materials);
    return group;
  }

  get cutWaterList() {
    return this.form.get('cut_water') as FormArray;
  }

  newCutWater() {
    if (this.form.valid) {
      let water = this.cutWaterList;
      water.push(this.cutWaterControl())
    } else {
      this.form.markAllAsTouched();
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  deleteCutWater(i) {
    this.cutWaterList.removeAt(i);
    cutWaterHelper.subtotalUnit(this.cutWaterList, this.form);
  }

  /************** Corte de Agua Termina ****************/


  /************** Corte laser Termina ****************/

  cutLaserControl(): FormGroup {
    let group = help.cutLaserHelper.createCutLaserGroup(this.form, this.fb, this.cutLaserMaterials);
    return group;
  }

  get cutLaserList() {
    return this.form.get('cut_laser') as FormArray;
  }

  newCutLaser() {
    if (this.form.valid) {
      let laser = this.cutLaserList;
      laser.push(this.cutLaserControl());
    } else {
      this.form.markAllAsTouched();
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  deleteCutLaser(i) {
    this.cutLaserList.removeAt(i);
    cutLaserHelper.subtotalUnit(this.cutLaserList, this.form);
  }

  /************** Corte laser Termina ****************/

  /************** Maquinas Herramientas Inicia ****************/

  machineToolsControl(element): FormGroup {
    let group = help.machineToolHelper.createMachineToolGroup(this.form, this.fb, element);
    return group;
  }

  get machineToolList() {
    return this.form.get('machine_tools') as FormArray;
  }

  machineSet(item, event) {
    let machine_item = item as FormGroup;
    this.maquinas_herramientas?.forEach(element => {
      if (element?.value == event?.target?.value) {
        let machine = element
        machine_item.patchValue({
          unit_id: machine?.unit?.id,
          unit_cost: machine?.unit_cost
        })
        /* machine_item.controls.unit_id.disable()
        machine_item.controls.unit_cost.disable() */
      }
    });
  }

  internalSet(item, event) {
    let internal_item = item as FormGroup;
    this.procesos_internos?.forEach(element => {
      if (element?.value == event?.target?.value) {
        let internal = element
        internal_item?.patchValue({
          unit_id: internal?.unit?.id,
          unit_cost: internal?.unit_cost
        })
        /* internal_item.controls.unit_id.disable()
        internal_item.controls.unit_cost.disable() */
      }
    });
  }
  externalSet(item, event) {
    let external_item = item as FormGroup;
    this.procesos_externos?.forEach(element => {
      if (element?.value == event?.target?.value) {
        let external = element
        external_item?.patchValue({
          unit_id: external?.unit?.id,
          unit_cost: external?.unit_cost
        })
        /* external_item.controls.unit_id.disable()
        external_item.controls.unit_cost.disable() */
      }
    });
  }

  async newMachineTool() {
    if (this.form?.valid) {
      let maquinas_herramientas_aux = Array.from(this.maquinas_herramientas);
      let machine = this.machineToolList;
      const results = maquinas_herramientas_aux?.filter(({ value: id1 }) => !machine?.value?.some(({ description: id2 }) => id2 == id1)); // 😍😍😍😍😍
      results.forEach(element => {
        machine?.push(this.machineToolsControl(element))
      });
    } else {
      this.form.markAllAsTouched();
      this.scroll.scrollToPosition([0, 0]);
    }
  }

  deleteMachineTool(i) {
    this.machineToolList?.removeAt(i);
    machineToolHelper?.subtotalMachine(this.machineToolList, this.form);
  }

  deleteAllMachineTool() {
    this.machineToolList?.clear()
    machineToolHelper?.subtotalMachine(this.machineToolList, this.form);
  }

  /************** Maquinas Herramientas termina ****************/

  /************** Procesos Internos Inicia ****************/

  internalProccessesControl(element): FormGroup {
    let group = help?.internalProccessesHelper?.createInternalProccessesGroup(this.form, this.fb, element);
    return group;
  }

  get internalProccessList() {
    return this.form.get('internal_proccesses') as FormArray;
  }

  newInternalProccesses() { //!
    if (this.form?.valid) {
      let procesos_internos_aux = Array.from(this.procesos_internos);
      let internalProccess = this.internalProccessList;
      const results = procesos_internos_aux?.filter(({ value: id1 }) => !internalProccess?.value?.some(({ description: id2 }) => id2 == id1)); // 😍😍😍😍😍
      results?.forEach(element => {
        internalProccess?.push(this.internalProccessesControl(element))
      });
    } else {
      this.form?.markAllAsTouched();
      this.scroll?.scrollToPosition([0, 0]);
    }
  }

  deleteInternalProccess(i) {
    this.internalProccessList?.removeAt(i);
    internalProccessesHelper?.subtotalInternalProcesses(this.internalProccessList, this.form)
  }

  deleteAllInternalProccess() {
    this.internalProccessList?.clear();
    internalProccessesHelper?.subtotalInternalProcesses(this.internalProccessList, this.form)
  }

  /************** Procesos Internos Termina ****************/

  /************** Procesos Externos Inicia ****************/

  externalProccessesControl(element): FormGroup {
    let group = help?.externalProccessesHelper?.createExternalProccessesGroup(this.form, this.fb, element);
    return group;
  }

  get externalProccessList() {
    return this.form.get('external_proccesses') as FormArray;
  }

  newExternalProccesses() {
    if (this.form?.valid) {
      let procesos_externos_aux = Array.from(this.procesos_externos);
      let exteranlProccess = this.externalProccessList;
      const results = procesos_externos_aux?.filter(({ value: id1 }) => !exteranlProccess?.value?.some(({ description: id2 }) => id2 == id1)); // 😍😍😍😍😍
      results?.forEach(element => {
        exteranlProccess?.push(this.externalProccessesControl(element))
      });
    } else {
      this.form?.markAllAsTouched();
      this.scroll?.scrollToPosition([0, 0]);
    }
  }

  deleteExternalProccess(i) {
    this.externalProccessList?.removeAt(i);
    externalProccessesHelper?.subtotalExternalProcesses(this.externalProccessList, this.form);
  }

  deleteAllExternalProccess() {
    this.externalProccessList?.clear();
    externalProccessesHelper?.subtotalExternalProcesses(this.externalProccessList, this.form);
  }

  /************** Procesos Externos termina ****************/

  /************** Otros Inicia ****************/

  othersControl(): FormGroup {
    let group = help?.othersHelper?.createOthersGroup(this.form, this.fb);
    return group;
  }

  get othersList() {
    return this.form.get('others') as FormArray;
  }

  newOthersList() {
    if (this.form?.valid) {
      let others = this.othersList;
      others?.push(this.othersControl())
    } else {
      this.form?.markAllAsTouched();
      this.scroll?.scrollToPosition([0, 0]);
    }

  }

  deleteOthers(i) {
    this.othersList?.removeAt(i);
    othersHelper?.subtotalOthers(this.othersList, this.form);
  }

  /************** Otros Termina ****************/

  get indirecCostList() {
    return this.form.get('indirect_cost') as FormArray;
  }

  indirectCostPush() {
    let indirect_cost = this.form.get('indirect_cost') as FormArray;
    indirect_cost?.clear();
    this.indirectCosts?.forEach(element => {
      indirect_cost?.push(this.indirectCostgroup(element, this.fb, this.form));
    });
  }

  indirectCostgroup(element, fb: FormBuilder, form: FormGroup) {
    let group = fb.group({
      name: [element?.text],
      percentage: [element?.percentage],
      value: [0]
    });
    help.functionsApu?.indirectCostOp(group, form);
    return group;
  }

  save() {
    if (this.form?.invalid) {
      this._swal.incompleteError();
      this.form.markAllAsTouched()
    } else {
      let filess = this.files;
      filess.forEach(elem => {
        let file = elem;
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.fileString = {
            base64: (<FileReader>event.target).result,
            name: elem.name,
            type: elem.type
          };
        };
        functionsUtils.fileToBase64(file).subscribe((base64) => {
          this.file = base64;
          this.fileArr.push(this.fileString);
        });
      });
      this.form.patchValue({
        files: this.fileArr
      });
      this._swal.show({
        text: `Vamos a ${this.id && this.title == 'Editar pieza' ? 'editar' : 'crear'} una pieza`,
        title: '¿Estás seguro(a)?',
        icon: 'question',
      }).then((r) => {
        if (r.isConfirmed) {
          if (this.id && this.title == 'Editar pieza') {
            this._apuPieza.update(this.form.value, this.id).subscribe(
              (res: any) => this.showSuccess(res),
              (err) => this.showError(err)
            );
          } else {
            this._apuPieza.save(this.form.value).subscribe(
              (res: any) => {
                if (this.preData) {
                  this.saveForAddToSet.emit(res.data)
                }
                this.showSuccess(res)
              },
              (err) => this.showError(err)
            );
          }
        }
      });
    }
  }

  showSuccess(res) {
    if (res.status) {
      this._swal.show({
        icon: 'success',
        text: `Pieza ${this.id && this.title == 'Editar pieza' ? 'editada' : 'creada'} con éxito`,
        title: 'Operación exitosa',
        showCancel: false,
        timer: 1000
      });
      if (!this.preData) {
        this.router.navigateByUrl(`/crm/apu/ver-apu-pieza/${res.data.id}`);
      }
    } else {
      this._swal.hardError();
    }
  }
  showError(err) {
    this._swal.hardError();
  }

}
