import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApuConjuntoService } from '../apu-conjunto.service';
import * as help from './helpers/imports';
import { machineToolHelper } from './helpers/machine-tools';
import { internalProcessesHelper } from './helpers/internal_proccesses';
import { externalProcessesHelper } from './helpers/external_proccesses';
import { othersHelper } from './helpers/others';
import { piecesSetsHelper } from './helpers/piecesSets';
import { Router } from '@angular/router';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { concat, Observable, Subject, of } from 'rxjs';
import { map, filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError } from 'rxjs/operators';
import { CalculationBasesService } from '../../../ajustes/configuracion/base-calculos/calculation-bases.service';
import { ProcesosExternosService } from 'src/app/pages/ajustes/parametros/apu/procesos-externos/procesos-externos.service';
import { ProcesosInternosService } from 'src/app/pages/ajustes/parametros/apu/procesos-internos/procesos-internos.service';
import { MaquinasHerramientasService } from 'src/app/pages/ajustes/parametros/apu/maquinas-herramientas/maquinas-herramientas.service';
import { UnidadesMedidasService } from 'src/app/pages/ajustes/parametros/apu/unidades-medidas/unidades-medidas.service';
interface ApuPart {
  name: string;
  id: number;
}

@Component({
  selector: 'app-crear-apu-conjunto',
  templateUrl: './crear-apu-conjunto.component.html',
  styleUrls: ['./crear-apu-conjunto.component.scss']
})
export class CrearApuConjuntoComponent implements OnInit {
  @Input('id') id;
  @Input('data') data: any;
  form: FormGroup;
  formGroup: FormGroup;
  filters_apu = {
    type_multiple: 'pyc'
  }
  date: Date = new Date();
  indirectCosts: any[] = [];
  files: File[] = [];
  fileString: any = '';
  file = '';
  fileArr: any[] = [];
  people: any[] = [];
  cities: any[] = [];
  clients: any[] = [];
  apuParts: any[] = [];
  apuSets: any[] = [];
  procesos_internos: any[] = [];
  procesos_externos: any[] = [];
  maquinas_herramientas: any[] = [];
  units: any[] = [];
  otherCollapsed: boolean;
  indirectCollapsed: boolean;
  auiCollapsed: boolean;
  people$: Observable<any>;
  peopleLoading = false;
  peopleInput$ = new Subject<string>();
  minLengthTerm = 3;
  searching: boolean;
  searchFailed: boolean;
  searchingSet: boolean;
  searchFailedSet: boolean;
  calculationBase: any = {}
  @ViewChild('apus') apus: any

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _apuConjunto: ApuConjuntoService,
    private _swal: SwalService,
    private _calculationBase: CalculationBasesService,
    private _externos: ProcesosExternosService,
    private _internos: ProcesosInternosService,
    private _maquinas: MaquinasHerramientasService,
    private _units: UnidadesMedidasService,
  ) {

  }

  ngOnInit(): void {
    // await this.getBases()
    this.getPeople();
    this.getCities();
    this.getClients();
    this.getApuSets();
    this.getApuPart();
    this.getUnits();
    this.createForm();
    this.getIndirectCosts();
    this.validateData();
    this.collapses();
    this.loadPeople();
    this.getVariablesApu();

  }

  getUnits() {
    this._units.selectUnits().subscribe((r: any) => {
      this.units = r.data;
    })
  }

  getVariablesApu() {
    this._externos.getExternos().subscribe((res: any) => {
      this.procesos_externos = res.data
    })
    this._maquinas.getMaquinas().subscribe((res: any) => {
      this.maquinas_herramientas = res.data
    })
    this._internos.getExternos().subscribe((res: any) => {
      this.procesos_internos = res.data
    })
  }

  machineSet(item, event) {
    let machine_item = item as FormGroup;
    this.maquinas_herramientas.forEach(element => {
      if (element.value == event.target.value) {
        let machine = element
        machine_item.patchValue({
          unit_id: machine.unit.id,
          unit_cost: machine.unit_cost
        })
        /* machine_item.controls.unit_id.disable()
        machine_item.controls.unit_cost.disable() */
      }
    });
  }

  internalSet(item, event) {
    let internal_item = item as FormGroup;
    this.procesos_internos.forEach(element => {
      if (element.value == event.target.value) {
        let internal = element
        internal_item.patchValue({
          unit_id: internal.unit.id,
          unit_cost: internal.unit_cost
        })
        /* internal_item.controls.unit_id.disable()
        internal_item.controls.unit_cost.disable() */
      }
    });
  }
  externalSet(item, event) {
    let external_item = item as FormGroup;
    this.procesos_externos.forEach(element => {
      if (element.value == event.target.value) {
        let external = element
        external_item.patchValue({
          unit_id: external.unit.id,
          unit_cost: external.unit_cost
        })
        /* external_item.controls.unit_id.disable()
        external_item.controls.unit_cost.disable() */
      }
    });
  }

  collapses() {
    if (this.data == undefined) {
      return null;
    }
    (this.data.other.length < 0 ? this.otherCollapsed = false : this.otherCollapsed = true);
  }

  getApuSets() {
    this._apuConjunto.getApuSetList().subscribe((r: any) => {
      this.apuSets = r.data;
    })
  }

  getApuPart() {
    this._apuConjunto.getApuParts().subscribe((r: any) => {
      this.apuParts = r.data;
    })
  }

  loadPeople() {
    this.people$ = concat(
      of([]), // default items
      this.peopleInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.peopleLoading = true),
        switchMap(term => {
          let param = { name: term }
          return this._apuConjunto.getPeopleXSelect(param).pipe(
            map((r: any) => { return r.data }),
            catchError(() => of([])), // empty list on error
            tap(() => this.peopleLoading = false)
          )
        })
      )
    );
  }

  searchSet = (text$: Observable<string>) => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.searchingSet = true),
    switchMap(name =>
      this._apuConjunto.getApuSetList({ name }).pipe(
        map((r: any) => r.data),
        tap(() => this.searchFailedSet = false),
        catchError(() => {
          this.searchFailedSet = true;
          return of([]);
        }))

    ),
    tap(() => this.searchingSet = false)
  )

  formatterSet = (x: { name: string }) => x.name;

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.searching = true),
    switchMap(name =>
      this._apuConjunto.getApuParts({ name }).pipe(
        map((r: any) => r.data),
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }))

    ),
    tap(() => this.searching = false)
  )

  formatter = (x: { name: string }) => x.name;

  select(group: FormGroup, key, toUpdate) {

    let control = group.get(key).value
    if (typeof control == 'object') {
      group.patchValue({ [toUpdate]: control['id'] })
    } else {
      group.patchValue({ [toUpdate]: '' })
    }
    /*         group.patchValue({ [key]: e.target.value })
         return e.preventDefault() */
  }

  findApus() {
    // this.formGroup = item;
    this.apus.openConfirm()
  }

  getApus(e: any[]) {
    let item = this.form.get('list_pieces_sets') as FormArray
    e.forEach(apu => {
      const exist = item.value.some(x => (x.apu_id == apu.apu_id && x.type_module == apu.type_module))
      !exist ? item.push(this.piecesSetsControl(apu)) : ''
    });

  }


  async getBases() {
    await this._calculationBase.getAll().toPromise().then((r: any) => {
      this.calculationBase = r.data.reduce((acc, el) => ({ ...acc, [el.concept]: el }), {})
      /* if (this.dataEdit) {
        this.calculationBase.trm.value = this.dataEdit.trm
      } */
    })
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  createForm() {
    this.form = help.functionsApuConjunto.createForm(this.fb);
    help.functionsApuConjunto.listerTotalDirectCost(this.form);
  }

  getIndirectCosts() {
    this._apuConjunto.getIndirectCosts().subscribe((r: any) => {
      this.indirectCosts = r.data;
      if (!this.data) {
        this.indirectCostPush();
      }
    })
  };

  validateData() {
    if (this.data) {
      setTimeout(() => {
        help.functionsApuConjunto.fillInForm(this.form, this.data, this.fb, this.apuParts);
      }, 1200);
    }
  }

  getPeople() {
    this._apuConjunto.getPeopleXSelect().subscribe((r: any) => {
      this.people = r.data;
    })
  }

  getCities() {
    this._apuConjunto.getCities().subscribe((r: any) => {
      this.cities = r.data;
      help.functionsApuConjunto.cityRetention(this.form, this.cities);
    })
  }

  getClients() {
    this._apuConjunto.getClient().subscribe((r: any) => {
      this.clients = r.data;
    })
  }

  piecesSetsControl(item): FormGroup {
    let group = help.piecesSetsHelper.createPiecesSetsGroup(this.form, this.fb, item);
    return group;
  }

  get piecesSetsList() {
    return this.form.get('list_pieces_sets') as FormArray;
  }

  newPiecesSets() {
    let machine = this.piecesSetsList;
    machine.push(this.piecesSetsControl(''))
  }

  deletePiecesSets(i) {
    this.piecesSetsList.removeAt(i);
    piecesSetsHelper.subtotalPieceSets(this.piecesSetsList, this.form);
  }

  machineToolsControl(): FormGroup {
    let group = help.machineToolHelper.createMachineToolGroup(this.form, this.fb);
    return group;
  }

  get machineToolList() {
    return this.form.get('machine_tools') as FormArray;
  }

  newMachineTool() {
    let machine = this.machineToolList;
    machine.push(this.machineToolsControl())
  }

  deleteMachineTool(i) {
    this.machineToolList.removeAt(i);
    machineToolHelper.subtotalMachine(this.machineToolList, this.form);
  }

  /************** Maquinas Herramientas termina ****************/

  /************** Procesos Internos Inicia ****************/

  internalProcessesControl(): FormGroup {
    let group = help.internalProcessesHelper.createInternalProcessesGroup(this.form, this.fb);
    return group;
  }

  get internalProcessList() {
    return this.form.get('internal_processes') as FormArray;
  }

  newInternalProccesses() {
    let internalProccess = this.internalProcessList;
    internalProccess.push(this.internalProcessesControl())
  }

  deleteInternalProccess(i) {
    this.internalProcessList.removeAt(i);
    internalProcessesHelper.subtotalInternalProcesses(this.internalProcessList, this.form)
  }

  /************** Procesos Internos Termina ****************/

  /************** Procesos Externos Inicia ****************/

  externalProcessesControl(): FormGroup {
    let group = help.externalProcessesHelper.createExternalProcessesGroup(this.form, this.fb);
    return group;
  }

  get externalProcessList() {
    return this.form.get('external_processes') as FormArray;
  }

  newExternalProccesses() {
    let exteranlProccess = this.externalProcessList;
    exteranlProccess.push(this.externalProcessesControl())
  }

  deleteExternalProccess(i) {
    this.externalProcessList.removeAt(i);
    externalProcessesHelper.subtotalExternalProcesses(this.externalProcessList, this.form);
  }

  /************** Procesos Externos termina ****************/

  /************** Otros Inicia ****************/

  othersControl(): FormGroup {
    let group = help.othersHelper.createOthersGroup(this.form, this.fb);
    return group;
  }

  get othersList() {
    return this.form.get('others') as FormArray;
  }

  newOthersList() {
    let others = this.othersList;
    others.push(this.othersControl())
  }

  deleteOthers(i) {
    this.othersList.removeAt(i);
    othersHelper.subtotalOthers(this.othersList, this.form);
  }

  /************** Otros Termina ****************/

  get indirecCostList() {
    return this.form.get('indirect_cost') as FormArray;
  }

  indirectCostPush() {
    let indirect_cost = this.form.get('indirect_cost') as FormArray;
    indirect_cost.clear();
    this.indirectCosts.forEach(element => {
      indirect_cost.push(this.indirectCostgroup(element, this.fb, this.form));
    });
  }

  indirectCostgroup(element, fb: FormBuilder, form: FormGroup) {
    let group = fb.group({
      name: [element.text],
      percentage: [element.percentage],
      value: [0]
    });
    help.functionsApuConjunto.indirectCostOp(group, form);
    return group;
  }

  save() {
    let filess = this.files;
    filess.forEach(elem => {
      let file = elem;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.fileArr.push(this.fileString);
      });
    });
    this.form.patchValue({
      files: this.fileArr
    });
    console.log(this.form.value);

    this._swal
      .show({
        text: `Se dispone a ${this.id ? 'editar' : 'crear'} un apu conjunto`,
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id) {
            this._apuConjunto.update(this.form.value, this.id).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          } else {
            this._apuConjunto.save(this.form.value).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          }
        }
      });
  }

  apuIdToCreateOrEdit() {
    let pieces_sets = this.form.get('list_pieces_sets') as FormArray;
    pieces_sets.controls.forEach(element => {
      let apu_id = element.get('apu_id').value.id
      element.patchValue({
        apu_id
      })
    });
  }

  showSuccess() {
    this._swal.show({
      icon: 'success',
      text: `Apu conjunto ${this.id ? 'editado' : 'creado'} con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
    });
    this.router.navigateByUrl('/crm/apus');
  }
  showError(err) {
    this._swal.show({
      icon: 'error',
      title: '¡Ooops!',
      showCancel: false,
      text: err.code,
    });
  }
}
