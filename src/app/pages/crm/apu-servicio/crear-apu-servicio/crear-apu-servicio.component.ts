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
  profiles = [
    { name: 'Supervisor' },
    { name: 'Soldador' },
  ]

  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 }
  ]

  jornadas = [
    { text: 'Diurna', value: 1 },
    { text: 'Nocturna', value: 2 }
  ]

  constructor(
                private _apuService: ApuServicioService,
                private fb: FormBuilder,
                private _swal: SwalService,
                private router: Router
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getClients();
    this.getPeople();
    this.getCities();
  }

  createForm(){
    this.form = help.functionsApuService.createForm(this.fb, this.clients);
  }

  getPeople(){
    this._apuService.getPeopleXSelect().subscribe((r:any) => {
      this.people = r.data;
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

  cmoControl(): FormGroup{ // cmo = Calculo Mano Obra
    let group = help.cmoHelper.createcmoGroup(this.form, this.fb);
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
    let group = help.mpmCalculateLaborHelper.createMpmCalculateLaborGroup(this.form, this.fb);
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
