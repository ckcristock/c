import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { negocios } from '../data';
import { NegociosService } from '../negocios.service';
import { Business } from './negocio.inteface';
import {
  negocioData,
  OTROS_PRESUPUESTOS,
  OTRAS_COTIZACIONES,
} from './negocio.data';

@Component({
  selector: 'app-ver-negocio',
  templateUrl: './ver-negocio.component.html',
  styleUrls: ['./ver-negocio.component.scss'],
})
export class VerNegocioComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('modalPresupuestos') modalPresupuestos: any;
  @ViewChild('modalCotizaciones') modalCotizaciones: any;

  tareas: any[];
  data = negocios;
  active = 1;
  loading = false;

  contactos: any[];
  negocio: Business = negocioData;

  dataModal: any = [];

  presupuestos: any[];
  presupuestosSeleccionados: any[] = [];
  cotizaciones: any[];
  cotizacionesSeleccionadas: any[] = [];

  modal_title = '';

  filtros = {
    id: '',
  };

  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService
  ) {}

  ngOnInit(): void {
    this.getPresupuestos();
    this.getCotizaciones();
    this.getTasks();
    this.filtros.id = this.ruta.snapshot.params.id;
    this.negocio.id = this.ruta.snapshot.params.id;
  }

  getPresupuestos() {
    this.loading = true;
    this._negocio.getBudgets().subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      console.log(this.presupuestos);
      this.loading = false;
    });
    // this.presupuestos = OTROS_PRESUPUESTOS;
  }

  guardarPresupuesto(id) {
    if (this.presupuestosSeleccionados.includes(id))
      this.presupuestosSeleccionados = this.presupuestosSeleccionados.filter(
        (pres) => pres !== id
      );
    else this.presupuestosSeleccionados.push(id);
  }
  guardarCotizacion(id) {
    if (this.cotizacionesSeleccionadas.includes(id))
      this.cotizacionesSeleccionadas = this.cotizacionesSeleccionadas.filter(
        (cot) => cot !== id
      );
    else this.cotizacionesSeleccionadas.push(id);
  }

  getCotizaciones() {
    this.cotizaciones = OTRAS_COTIZACIONES;
  }

  getTasks() {
    this._negocio.getTasks().subscribe((data: any) => {
      this.tareas = data;
    });
  }

  createTask(event) {
    this._negocio.createTask(event).subscribe(() => {
      this.addEventToHistory('Se creó una tarea en la seccion de tareas');
    });
    this.getTasks();
  }
  editTask(event) {
    this._negocio.editTask(event.index - 1, event.value).subscribe((data) => {
      this.addEventToHistory(
        'Se ha editado la tarea de ' + event.value.responsable
      );
    });
    this.getTasks();
  }

  addEventToHistory(desc) {
    this._negocio.addEventToHistroy(desc).subscribe(() => {
      console.log('Evento añadido');
    });
  }

  addPresupuesto() {
    this.presupuestosSeleccionados = this.negocio.presupuestos.map((n) => n.id);

    this.modalPresupuestos.show();
  }
  addCotizacion() {
    this.cotizacionesSeleccionadas = this.negocio.cotizaciones.map((n) => n.id);

    this.modalCotizaciones.show();
  }

  obtenerContactos(thirdCompany: string) {
    let params = {
      third: thirdCompany,
    };

    this._negocio.getThirdPartyPerson(params).subscribe((resp: any) => {
      this.contactos = resp.data;
    });
  }

  closeModalPresupuesto() {
    this.negocio.presupuestos = this.presupuestosSeleccionados;
    this.addEventToHistory('Se modificaron los presupuestos del negocio');
  }

  closeModalCotizaciones() {
    this.negocio.cotizaciones = this.cotizacionesSeleccionadas;
    this.addEventToHistory('se modificaron las cotizaciones del negocio');
  }
}
