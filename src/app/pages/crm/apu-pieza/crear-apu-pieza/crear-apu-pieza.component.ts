import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../apu-pieza.service';
import { UnidadesMedidasService } from '../../../ajustes/parametros/apu/unidades-medidas/unidades-medidas.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import * as help from './helpers/imports';

@Component({
  selector: 'app-crear-apu-pieza',
  templateUrl: './crear-apu-pieza.component.html',
  styleUrls: ['./crear-apu-pieza.component.scss']
})
export class CrearApuPiezaComponent implements OnInit {
  form: FormGroup;
  date: Date = new Date();
  people:any[] = [];
  cities:any[] = [];
  geometries:any[] = [];
  materials:any[] = [];
  clients:any[] = [];
  units:any[] = [];
  measures:any[] = [];

  constructor(
                private _apuPieza: ApuPiezaService,
                private _units: UnidadesMedidasService,
                private fb: FormBuilder
              ) { }

  ngOnInit(): void {
    this.getPeople();
    this.getCities();
    this.getGeometries();
    this.getMaterials();
    this.getClients();
    this.getUnits();
    this.createForm();
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
  
  createForm(){
    this.form = help.functionsApu.createForm(this.fb)
  }
  /************** Materia Prima Inicio ****************/
  basicControl(): FormGroup{
    let group = help.materiaHelper.createMateriaGroup(this.fb, this.geometries);
    return group;
  }

  get materiaList(){
    return this.form.get('materia_prima') as FormArray;
  }

  newMateria(){
    let materia = this.materiaList;
    materia.push(this.basicControl())
  }

  deleteMateria(){
    this.materiaList.removeAt(this.materiaList.length - 1);
  }
  /************** Materia Prima Fin ****************/

  /************** Materiales Comerciales Inicia ****************/
  materialsControl(): FormGroup{
    let group = help.materialsHelper.createMaterialsGroup(this.fb);
    return group;
  }

  get materialsList(){
    return this.form.get('commercial_materials') as FormArray;
  }

  newMaterial(){
    let materials = this.materialsList;
    materials.push(this.materialsControl())
  }

  deleteMaterial(){
    this.materialsList.removeAt(this.materialsList.length - 1);
  }

  /************** Materiales Comerciales Fin ****************/

  /************** Corte de Agua Inicia ****************/
  
  cutWaterControl(): FormGroup{
    let group = help.cutWaterHelper.createCutWaterGroup(this.fb);
    return group;
  }

  get cutWaterList(){
    return this.form.get('cut_water') as FormArray;
  }

  newCutWater(){
    let water = this.cutWaterList;
    water.push(this.cutWaterControl())
  }

  deleteCutWater(){
    this.cutWaterList.removeAt(this.cutWaterList.length - 1);
  }

  /************** Corte de Agua Termina ****************/


  /************** Corte laser Termina ****************/

  cutLaserControl(): FormGroup{
    let group = help.cutWaterHelper.createCutWaterGroup(this.fb);
    return group;
  }

  get cutLaserList(){
    return this.form.get('cut_laser') as FormArray;
  }

  newCutLaser(){
    let laser = this.cutLaserList;
    laser.push(this.cutLaserControl())
  }

  deleteCutLaser(){
    this.cutLaserList.removeAt(this.cutLaserList.length - 1);
  }

  /************** Corte laser Termina ****************/

  /************** Maquinas Herramientas Inicia ****************/

  machineToolsControl(): FormGroup{
    let group = help.machineToolHelper.createMachineToolGroup(this.fb);
    return group;
  }

  get machineToolList(){
    return this.form.get('machine_tools') as FormArray;
  }

  newMachineTool(){
    let machine = this.machineToolList;
    machine.push(this.machineToolsControl())
  }

  deleteMachineTool(){
    this.machineToolList.removeAt(this.machineToolList.length - 1);
  }

  /************** Maquinas Herramientas termina ****************/

  /************** Procesos Internos Inicia ****************/
  
  internalProccessesControl(): FormGroup{
    let group = help.machineToolHelper.createMachineToolGroup(this.fb);
    return group;
  }

  get internalProccessList(){
    return this.form.get('internal_proccesses') as FormArray;
  }

  newInternalProccesses(){
    let internalProccess = this.internalProccessList;
    internalProccess.push(this.internalProccessesControl())
  }

  deleteInternalProccess(){
    this.internalProccessList.removeAt(this.internalProccessList.length - 1);
  }

  /************** Procesos Internos Termina ****************/

  /************** Procesos Externos Inicia ****************/

  externalProccessesControl(): FormGroup{
    let group = help.externalProccessesHelper.createExternalProccessesGroup(this.fb);
    return group;
  }

  get externalProccessList(){
    return this.form.get('external_proccesses') as FormArray;
  }

  newExternalProccesses(){
    let exteranlProccess = this.externalProccessList;
    exteranlProccess.push(this.externalProccessesControl())
  }

  deleteExternalProccess(){
    this.externalProccessList.removeAt(this.externalProccessList.length - 1);
  }

  /************** Procesos Externos termina ****************/

  /************** Otros Inicia ****************/

  othersControl(): FormGroup{
    let group = help.othersHelper.createOthersGroup(this.fb);
    return group;
  }

  get othersList(){
    return this.form.get('others') as FormArray;
  }

  newOthersList(){
    let others = this.othersList;
    others.push(this.othersControl())
  }

  deleteOthers(){
    this.othersList.removeAt(this.othersList.length - 1);
  }

  /************** Otros Termina ****************/



  save(){
    console.log(this.form.value);
  }

}
