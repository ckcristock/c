import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApuServicioService } from '../apu-servicio.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import * as help from './helpers/imports';


@Component({
  selector: 'app-crear-apu-servicio',
  templateUrl: './crear-apu-servicio.component.html',
  styleUrls: ['./crear-apu-servicio.component.scss']
})
export class CrearApuServicioComponent implements OnInit {
  form: FormGroup;
  date:Date = new Date();
  people:any[] = [];
  cities:any[] = [];
  clients:any[] = [];
  collapsed:boolean[] = [];
  mpMcollapsed:boolean[] = [];
  profiles:any[] = [];
  tEestimations:any = [];
  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 },
    { text: 'N/A', value:3 }
  ]
  jornadas = [
    { text: 'Diurna', value: 'Diurna' },
    { text: 'Nocturna', value: 'Nocturna' }
  ]

  constructor(
                private _apuService: ApuServicioService,
                private fb: FormBuilder,
                private _swal: SwalService,
                private router: Router
              ) { }

  async ngOnInit() {
    this.createForm();
    this.getProfiles();
    this.getClients();
    this.getPeople();
    await this.getCities();
    this.getTravelExpenseEstimation();
  }

  createForm(){
    this.form = help.functionsApuService.createForm(this.fb, this.clients);
  }

  getPeople(){
    this._apuService.getPeopleXSelect().subscribe((r:any) => {
      this.people = r.data;
    })
  }

  getProfiles(){
    this._apuService.getProfiles().subscribe((r:any) => {
      this.profiles = r.data;
    })
  }

  getCities(){
    this._apuService.getCities().subscribe((r:any) => {
      this.cities = r.data;
    })
  }

  getClients(){
    this._apuService.getClient().subscribe((r:any) => {
      this.clients = r.data;
      help.functionsApuService.totalMasRetencion(this.form, this.clients);
    })
  }

  getTravelExpenseEstimation(){
    this._apuService.getTravelExpenseEstimation().subscribe((r:any) => {
      this.tEestimations = r.data;
    })
  }  

  cmoControl(): FormGroup{ // cmo = Calculo Mano Obra
    let group = help.cmoHelper.createcmoGroup(
          this.form, 
          this.fb, 
          this.profiles, 
          this.tEestimations, 
          this.cities);
    return group;
  }

  get cmoList(){
    return this.form.get('calculate_labor') as FormArray
  }

  newCmoList(){
    this.cmoList.push(this.cmoControl());
  }

  deleteCmoList(i){
    this.cmoList.removeAt(i);
  }

  mpMCalculateLaborControl(): FormGroup{ // cmo = Calculo Mano Obra
    let group = help.mpmCalculateLaborHelper.createMpmCalculateLaborGroup(this.form, this.fb, this.profiles);
    return group;
  }

  get mpMCalculateLaborList(){
    return this.form.get('mpm_calculate_labor') as FormArray
  }

  newmpMCalculateLaborList(){
    this.mpMCalculateLaborList.push(this.mpMCalculateLaborControl());
  }

  deletempMCalculateLaborList(i){
    this.mpMCalculateLaborList.removeAt(i);
  }

  save(){
    console.log(this.form);
  }

}
