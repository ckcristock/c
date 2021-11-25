import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  date:Date = new Date();
  form: FormGroup;
  people:any[] = [];
  cities:any[] = [];
  clients:any[] = [];

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
    help.functionsApuService.createForm(this.fb);
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
/*       help.functionsApuConjunto.totalMasRetencion(this.form, this.clients); */
  })
  }

}
