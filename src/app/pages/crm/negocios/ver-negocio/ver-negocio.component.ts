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
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/services/modal.service';

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
  negocio: any;

  dataModal: any = [];

  presupuestos: any[];
  presupuestosSeleccionados: any[] = [];
  cotizaciones: any[];
  cotizacionesSeleccionadas: any[] = [];
  business_budget_id: any = '';


  modal_title = '';

  filtros = {
    id: '',
  };
  budget_value: number;

  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService,
    private modalService: NgbModal,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.getBussines();
    this.getPresupuestos();
    this.getCotizaciones();
    this.getTasks();
    this.filtros.id = this.ruta.snapshot.params.id;
    //this.negocio.id = this.ruta.snapshot.params.id;
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }
  getBussines() {
    this._negocio.getBusiness(this.ruta.snapshot.params.id).subscribe((data: any) => {
      this.negocio = data.data;
    })
    this.business_budget_id = this.ruta.snapshot.params.id;
    //this.negocio.id = this.ruta.snapshot.params.id;
  }

  getPresupuestos() {
    this.loading = true;
    this._negocio.getBudgets().subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      this.loading = false;
    });
  }

  guardarPresupuesto(id, total_cop?) {
    if (this.presupuestosSeleccionados.includes(id))
      this.presupuestosSeleccionados = this.presupuestosSeleccionados.filter(
        (pres) => pres !== id
      );
    else this.presupuestosSeleccionados.push({
      budget_id: id,
      business_budget_id: this.ruta.snapshot.params.id,
      total_cop: total_cop
    });
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
  /*
    getTasks() {
      this._negocio.getTasks().subscribe((data: any) => {
        this.tareas = data;
      });
    }*/

  getTasks() {
    this._negocio.getTasks(this.business_budget_id).subscribe((resp: any) => {
      this.tareas = resp.data.data;
    });
  }

  updateListTask() {
    console.log("llego hasta aqui");

    this.getTasks();
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
    //this.presupuestosSeleccionados = this.presupuestos.map((n) => n.id);

    this.modalPresupuestos.show();
  }
  addCotizacion() {
    this.cotizacionesSeleccionadas = this.cotizaciones.map((n) => n.id);

  }

  obtenerContactos(thirdCompany: string) {
    let params = {
      third: thirdCompany,
    };

    this._negocio.getThirdPartyPerson(params).subscribe((resp: any) => {
      this.contactos = resp.data;
    });
  }

  saveBudget() {
    this.presupuestosSeleccionados.reduce((a, b) => {
      return this.budget_value = a + b.total_cop;
    }, this.negocio.budget_value)
    let data = {
      business_id: this.filtros.id,
      budget_value: this.budget_value,
      budgets: this.presupuestosSeleccionados
    }
    this._negocio.newBusinessBudget(data).subscribe(data => {
      this.addEventToHistory('Se modificaron los presupuestos del negocio');
      this.getBussines();
      this.getPresupuestos();
      this.modalService.dismissAll();
      //this.modalPresupuestos.hide();
      this.presupuestosSeleccionados = [];
    });
  }

  closeModalCotizaciones() {
    this.negocio.cotizaciones = this.cotizacionesSeleccionadas;
    this.addEventToHistory('se modificaron las cotizaciones del negocio');
  }
}
