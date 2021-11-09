import { Component, Input, OnInit } from '@angular/core';
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
import { functionsApu } from './helpers/helper';

@Component({
  selector: 'app-crear-apu-pieza',
  templateUrl: './crear-apu-pieza.component.html',
  styleUrls: ['./crear-apu-pieza.component.scss']
})
export class CrearApuPiezaComponent implements OnInit {
  @Input('id') id;
  @Input('data') data;
  form: FormGroup;
  date: Date = new Date();
  people:any[] = [];
  cities:any[] = [];
  geometries:any[] = [];
  materials:any[] = [];
  clients:any[] = [];
  units:any[] = [];
  indirectCosts:any[] = [];
  files: File[] = [];
  fileString:any = '';
  file = '';
  fileArr:any[] = [];
  collapsed:boolean;

  thickness:any[] = [
    { percent: 1, value: 1 },
    { percent: 2, value: 2 },
    { percent: 3, value: 3 },
    { percent: 4, value: 4 },
    { percent: 5, value: 5 },
    { percent: 6, value: 6 },
  ]
  
  constructor(
    private _apuPieza: ApuPiezaService,
    private _units: UnidadesMedidasService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private router: Router,
    private actRoute: ActivatedRoute
    ) { }
    
  ngOnInit():void {
       this.getPeople();
       this.getCities();
       this.getGeometries();
       this.getMaterials();
       this.getClients();
       this.getUnits();
       this.createForm();
       this.validateData();
       this.getIndirectCosts();
  }
  
  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  
  createForm(){
    this.form = help.functionsApu.createForm(this.fb);
    help.functionsApu.listerTotalDirectCost(this.form);
  }

  getPeople(){
    this._apuPieza.getPeopleXSelect().subscribe((r:any) => {
      this.people = r.data;
    })
  }

  getCities(){
    this._apuPieza.getCities().subscribe((r:any) => {
      this.cities = r.data;
    })
  }

  getGeometries(){
    this._apuPieza.getGeometries().subscribe((r:any) => {
      this.geometries = r.data;
    })
  }

  getMaterials(){
    this._apuPieza.getMaterials().subscribe((r:any) => {
      this.materials = r.data;
    })
  }

  getClients(){
    this._apuPieza.getClient().subscribe((r:any) => {
      this.clients = r.data;
    })
  }

  getUnits(){
    this._units.getUnits().subscribe((r:any) => {
      this.units = r.data;
    })
  }

  getIndirectCosts(){
    this._apuPieza.getIndirectCosts().subscribe((r:any) => {
      this.indirectCosts = r.data;
      if(!this.data){
        this.indirectCostPush();
      }
    })
  }
  

  validateData() {
    if (this.data) {
      setTimeout(() => {
        help.functionsApu.fillInForm(this.form, this.data, this.fb, this.geometries);
      }, 1200);
    }
  }
  /************** Materia Prima Inicio ****************/
  basicControl(): FormGroup{
    let group = help.materiaHelper.createMateriaGroup(this.form, this.fb, this.geometries);
    return group;
  }

  get materiaList(){
    return this.form.get('materia_prima') as FormArray;
  }

  newMateria(){
    let materia = this.materiaList;
    materia.push(this.basicControl())
  }

  deleteMateria(i){
    this.materiaList.removeAt(i);
    materiaHelper.subtotalMateria(this.materiaList, this.form);
  }
  /************** Materia Prima Fin ****************/

  /************** Materiales Comerciales Inicia ****************/
  materialsControl(): FormGroup{
    let group = help.materialsHelper.createMaterialsGroup(this.form, this.fb);
    return group;
  }

  get materialsList(){
    return this.form.get('commercial_materials') as FormArray;
  }

  newMaterial(){
    let materials = this.materialsList;
    materials.push(this.materialsControl())
  }

  deleteMaterial(i){
    this.materialsList.removeAt(i);
    materialsHelper.subtotalMaterials(this.materialsList, this.form);
  }

  /************** Materiales Comerciales Fin ****************/

  /************** Corte de Agua Inicia ****************/
  
  cutWaterControl(): FormGroup{
    let group = help.cutWaterHelper.createCutWaterGroup(this.form, this.fb);
    return group;
  }

  get cutWaterList(){
    return this.form.get('cut_water') as FormArray;
  }

  newCutWater(){
    let water = this.cutWaterList;
    water.push(this.cutWaterControl())
  }

  deleteCutWater(i){
    this.cutWaterList.removeAt(i);
    cutWaterHelper.subtotalUnit(this.cutWaterList, this.form);
  }

  /************** Corte de Agua Termina ****************/


  /************** Corte laser Termina ****************/

  cutLaserControl(): FormGroup{
    let group = help.cutLaserHelper.createCutLaserGroup(this.form, this.fb);
    return group;
  }

  get cutLaserList(){
    return this.form.get('cut_laser') as FormArray;
  }

  newCutLaser(){
    let laser = this.cutLaserList;
    laser.push(this.cutLaserControl());
  }

  deleteCutLaser(i){
    this.cutLaserList.removeAt(i);
    cutLaserHelper.subtotalUnit(this.cutLaserList, this.form);
  }

  /************** Corte laser Termina ****************/

  /************** Maquinas Herramientas Inicia ****************/

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
  
  internalProccessesControl(): FormGroup{
    let group = help.internalProccessesHelper.createInternalProccessesGroup(this.form, this.fb);
    return group;
  }

  get internalProccessList(){
    return this.form.get('internal_proccesses') as FormArray;
  }

  newInternalProccesses(){
    let internalProccess = this.internalProccessList;
    internalProccess.push(this.internalProccessesControl())
  }

  deleteInternalProccess(i){
    this.internalProccessList.removeAt(i);
    internalProccessesHelper.subtotalInternalProcesses(this.internalProccessList, this.form)
  }

  /************** Procesos Internos Termina ****************/

  /************** Procesos Externos Inicia ****************/

  externalProccessesControl(): FormGroup{
    let group = help.externalProccessesHelper.createExternalProccessesGroup(this.form, this.fb);
    return group;
  }

  get externalProccessList(){
    return this.form.get('external_proccesses') as FormArray;
  }

  newExternalProccesses(){
    let exteranlProccess = this.externalProccessList;
    exteranlProccess.push(this.externalProccessesControl())
  }

  deleteExternalProccess(i){
    this.externalProccessList.removeAt(i);
    externalProccessesHelper.subtotalExternalProcesses(this.externalProccessList, this.form);
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
    help.functionsApu.indirectCostOp(group, form);
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
        // this.files.push(this.fileString);
        this.fileArr.push(this.fileString);
      });
    });
    this.form.patchValue({
      files: this.fileArr
    })
    console.log(this.form.value);
    /* this.form.patchValue({
      files: filess
    }) */
    this._swal
      .show({
        text: `Se dispone a ${ this.id ? 'editar' : 'crear' } un apu pieza`,
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id) {
            console.log(this.id);
            this._apuPieza.update(this.form.value, this.id).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          } else {
            this._apuPieza.save(this.form.value).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          }
        }
      });
  }

  showSuccess() {
    this._swal.show({
      icon: 'success',
      text: `Apu Pieza ${ this.id ? 'editado' : 'creado' } con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
    });
    this.router.navigateByUrl('/crm/apu-pieza');
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
