import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegociosService } from '../negocios.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { QuotationService } from '../../cotizacion/quotation.service';
@Component({
  selector: 'app-ver-negocio',
  templateUrl: './ver-negocio.component.html',
  styleUrls: ['./ver-negocio.component.scss'],
})
export class VerNegocioComponent implements OnInit {
  @ViewChild('modalCotizaciones') modalCotizaciones: any;
  active = 1;
  loading: boolean;
  contactos: any[];
  negocio: any;
  presupuestos: any[];
  presupuestosSeleccionados: any[] = [];
  cotizaciones: any[];
  cotizacionesSeleccionadas: any[] = [];
  business_budget_id: any = '';
  budget_value: number;
  qr;
  loadingBudgets: boolean;
  loadingQuotation: boolean;
  filtros = {
    id: '',
  };
  filtersQuotations = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }
  paginationQuotations: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  paginationBudgets: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtersBudgets = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }
  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService,
    private _modal: ModalService,
    private _sanitizer: DomSanitizer,
    private _quotation: QuotationService,
  ) {
    this.filtros.id = this.ruta.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getBussines();
  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'xl')
  }

  getBussines() {
    this.loading = true;
    this._negocio.getBusiness(this.filtros.id).subscribe((data: any) => {
      this.qr = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.code)
      this.negocio = data.data;
      this.loading = false;
    })
    this.business_budget_id = this.ruta.snapshot.params.id;
  }

  getPresupuestos(page = 1) {
    this.presupuestosSeleccionados = []
    this.paginationBudgets.page = page;
    let params = {
      ...this.paginationBudgets,
      ...this.filtersBudgets,
      third_party_id: this.negocio.third_party_id
    }
    this.loadingBudgets = true;
    this._negocio.getBudgets(params).subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      this.paginationBudgets.collectionSize = resp.data.total;
      this.loadingBudgets = false
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



  quotations: any[] = []
  getQuotations(page = 1) {
    this.cotizacionesSeleccionadas = []
    this.paginationQuotations.page = page;
    let params = {
      ...this.paginationQuotations,
      ...this.filtersQuotations,
      third_party_id: this.negocio.third_party_id
    }
    this.loadingQuotation = true;
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.loadingQuotation = false;
      this.paginationQuotations.collectionSize = res.data.total;
    })
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
      this._modal.close();
      this.presupuestosSeleccionados = [];
    });
  }

  closeModalCotizaciones() {
    this.negocio.cotizaciones = this.cotizacionesSeleccionadas;
    this.addEventToHistory('se modificaron las cotizaciones del negocio');
  }

  createTask(event) {
    this._negocio.createTask(event).subscribe(() => {
      this.addEventToHistory('Se creó una tarea en la seccion de tareas');
    });
  }
  editTask(event) {
    this._negocio.editTask(event.index - 1, event.value).subscribe((data) => {
      this.addEventToHistory(
        'Se ha editado la tarea de ' + event.value.responsable
      );
    });
  }

  addEventToHistory(desc) {
    this._negocio.addEventToHistroy(desc).subscribe(() => {
      console.log('Evento añadido');
    });
  }
}
