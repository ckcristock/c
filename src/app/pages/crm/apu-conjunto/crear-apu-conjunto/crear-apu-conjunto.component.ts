import { Component, Input, OnInit } from '@angular/core';
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
  @Input('data') data:any;
  form: FormGroup;
  date:Date = new Date();
  indirectCosts:any[] = [];
  files: File[] = [];
  fileString:any = '';
  file = '';
  fileArr:any[] = [];
  people:any[] = [];
  cities:any[] = [];
  clients:any[] = [];
  apuParts:any[] = [];
  apuSets:any[] = [];
  otherCollapsed:boolean;
  indirectCollapsed:boolean;
  auiCollapsed:boolean;
  peopleLoading = false;
  apuPart$: Observable<any>;
  apuPartLoading = false;
  apuPartInput$ = new Subject<string>();
  minLengthTerm = 3;
    
  constructor( 
                private fb: FormBuilder,
                private router: Router,
                private _apuConjunto: ApuConjuntoService,
                private _swal: SwalService
              ) {
                
              }

  ngOnInit(): void {
    this.getPeople();
    this.getCities();
    this.getClients();
    this.getApuParts();
    this.getApuSets();
    this.createForm();
    this.getIndirectCosts();
    this.validateData();
    this.collapses();
    this.loadApuParts();
  }

  collapses(){
    if (this.data == undefined) {
      return null;
    }
    (this.data.other.length < 0 ? this.otherCollapsed = false : this.otherCollapsed = true);
  }
  
  getApuParts(){
    this._apuConjunto.getApuParts().subscribe((r:any) => {
      this.apuParts = r.data.data;
    })
  }

  getApuSets(){
    this._apuConjunto.getApuSets().subscribe((r:any) => {
      this.apuSets = r.data.data;
    })
  }

  loadApuParts() {
    this.apuPart$ = concat(
      of([]), // default items
      this.apuPartInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.apuPartLoading = true),
        switchMap(term => {
          let param = { name: term }
          return this._apuConjunto.getApuSets(param).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.apuPartLoading = false)
          )
        })
      )
    );
  } 

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  createForm(){
    this.form = help.functionsApuConjunto.createForm(this.fb);
    help.functionsApuConjunto.listerTotalDirectCost(this.form);
  }

  getIndirectCosts(){
    this._apuConjunto.getIndirectCosts().subscribe((r:any) => {
      this.indirectCosts = r.data;
      if(!this.data){
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

  getPeople(){
    this._apuConjunto.getPeopleXSelect().subscribe((r:any) => {
      this.people = r.data;
    })
  }

  getCities(){
    this._apuConjunto.getCities().subscribe((r:any) => {
      this.cities = r.data;
    })
  }

  getClients(){
    this._apuConjunto.getClient().subscribe((r:any) => {
      this.clients = r.data;
    })
  }

  piecesSetsControl(): FormGroup{
    let group = help.piecesSetsHelper.createPiecesSetsGroup(this.form, this.fb, this.apuParts, this.apuSets);
    return group;
  }

  get piecesSetsList(){
    return this.form.get('list_pieces_sets') as FormArray;
  }

  newPiecesSets(){
    let machine = this.piecesSetsList;
    machine.push(this.piecesSetsControl())
  }

  deletePiecesSets(i){
    this.piecesSetsList.removeAt(i);
    piecesSetsHelper.subtotalPieceSets(this.piecesSetsList, this.form);
  }

  machineToolsControl(): FormGroup{
    let group = help.machineToolHelper.createMachineToolGroup(this.form, this.fb);
    return group;
  }

  get machineToolList(){
    return this.form.get('machine_tools') as FormArray;
  }

  newMachineTool(){
    let machine = this.machineToolList;
    machine.push(this.machineToolsControl())
  }

  deleteMachineTool(i){
    this.machineToolList.removeAt(i);
    machineToolHelper.subtotalMachine(this.machineToolList, this.form);
  }

  /************** Maquinas Herramientas termina ****************/

  /************** Procesos Internos Inicia ****************/
  
  internalProcessesControl(): FormGroup{
    let group = help.internalProcessesHelper.createInternalProcessesGroup(this.form, this.fb);
    return group;
  }

  get internalProcessList(){
    return this.form.get('internal_processes') as FormArray;
  }

  newInternalProccesses(){
    let internalProccess = this.internalProcessList;
    internalProccess.push(this.internalProcessesControl())
  }

  deleteInternalProccess(i){
    this.internalProcessList.removeAt(i);
    internalProcessesHelper.subtotalInternalProcesses(this.internalProcessList, this.form)
  }

  /************** Procesos Internos Termina ****************/

  /************** Procesos Externos Inicia ****************/

  externalProcessesControl(): FormGroup{
    let group = help.externalProcessesHelper.createExternalProcessesGroup(this.form, this.fb);
    return group;
  }

  get externalProcessList(){
    return this.form.get('external_processes') as FormArray;
  }

  newExternalProccesses(){
    let exteranlProccess = this.externalProcessList;
    exteranlProccess.push(this.externalProcessesControl())
  }

  deleteExternalProccess(i){
    this.externalProcessList.removeAt(i);
    externalProcessesHelper.subtotalExternalProcesses(this.externalProcessList, this.form);
  }

  /************** Procesos Externos termina ****************/

  /************** Otros Inicia ****************/

  othersControl(): FormGroup{
    let group = help.othersHelper.createOthersGroup(this.form, this.fb);
    return group;
  }

  get othersList(){
    return this.form.get('others') as FormArray;
  }

  newOthersList(){
    let others = this.othersList;
    others.push(this.othersControl())
  }

  deleteOthers(i){
    this.othersList.removeAt(i);
    othersHelper.subtotalOthers(this.othersList, this.form);
  }

  /************** Otros Termina ****************/
  
  get indirecCostList(){
    return this.form.get('indirect_cost') as FormArray;
  }
  
  indirectCostPush(){
    let indirect_cost = this.form.get('indirect_cost') as FormArray;
    indirect_cost.clear();
    this.indirectCosts.forEach(element => {
      indirect_cost.push(this.indirectCostgroup(element, this.fb, this.form));
    });
  }
  
  indirectCostgroup(element, fb: FormBuilder, form: FormGroup){
    let group = fb.group({
      name: [element.text],
      percentage: [element.percentage],
      value: [0]
    });
    help.functionsApuConjunto.indirectCostOp(group, form);
    return group;
  }

  save(){
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
    this._swal
      .show({
        text: `Se dispone a ${ this.id ? 'editar' : 'crear' } un apu conjunto`,
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id) {
            // this.apuIdToCreateOrEdit();
            this._apuConjunto.update(this.form.value, this.id).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          } else {
            // this.apuIdToCreateOrEdit();
            this._apuConjunto.save(this.form.value).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          }
        }
      });
  }

  apuIdToCreateOrEdit(){
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
      text: `Apu conjunto ${ this.id ? 'editado' : 'creado' } con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
    });
    this.router.navigateByUrl('/crm/apu/apu-conjunto');
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
