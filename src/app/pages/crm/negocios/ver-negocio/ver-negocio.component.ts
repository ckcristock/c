import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { negocios } from '../data';
import { NegociosService } from '../negocios.service';
import { Business } from './negocio.inteface';
import { negocioData, OTROS_PRESUPUESTOS, OTRAS_COTIZACIONES } from './negocio.data';

@Component({
  selector: 'app-ver-negocio',
  templateUrl: './ver-negocio.component.html',
  styleUrls: ['./ver-negocio.component.scss'],
})
export class VerNegocioComponent implements OnInit {
  @ViewChild('modal') modal;
  @ViewChild('modalPresupuestos') modalPresupuestos;

  tareas: any[];
  data = negocios;
  active = 1

  contactos: any[];
  negocio: Business = negocioData;

  dataModal: any = [];

  presupuestos: any[];
  cotizaciones: any[];

  seleccionadas: any[]


  modal_title = "";

  filtros = {
    id: '',
  };

  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService,
  ) { }

  ngOnInit(): void {
    this.getPresupuestos()
    this.getCotizaciones();
    this.getTasks();
    this.filtros.id = this.ruta.snapshot.params.id;
    this.negocio.id = this.ruta.snapshot.params.id;
  }

  getPresupuestos() {
    this.presupuestos = OTROS_PRESUPUESTOS;
  }

  getCotizaciones() {
    this.cotizaciones = OTRAS_COTIZACIONES;
  }

  getTasks() {
    this._negocio.getTasks().subscribe((data: any) => {
      this.tareas = data;
    })
  }

  createTask(event) {
    this._negocio.createTask(event).subscribe(() => {
      console.log('guardado');
    })
    this.getTasks();
  }
  editTask(event) {
    this._negocio.editTask(event.index-1, event.value).subscribe((data) => {
      console.log(data);
    })
    this.getTasks();
  }

  addPresupuesto(title: string) {
    if (title == 'Presupuesto') {
      this.dataModal = this.presupuestos;
      this.seleccionadas = this.negocio.presupuestos
    } else {
      this.dataModal = this.cotizaciones
      this.seleccionadas = this.negocio.cotizaciones
    }
    this.modal_title = title;
    this.modalPresupuestos.show();
  }

  obtenerContactos(thirdCompany: string) {
    let params = {
      third: thirdCompany,
    };

    this._negocio.getThirdPartyPerson(params).subscribe((resp: any) => {
      this.contactos = resp.data;
    });
  }

  closeModal() {
    if (this.modal_title == 'Presupuesto') {
      this.negocio.presupuestos = this.seleccionadas;
    }
    else {
      this.negocio.cotizaciones = this.seleccionadas
    }
  }

}
