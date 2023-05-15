import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NegociosService } from '../negocios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { debounceTime } from 'rxjs/operators';
import { QuotationService } from '../../cotizacion/quotation.service';
import { Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-modal-buscar-cotizacion',
  templateUrl: './modal-buscar-cotizacion.component.html',
  styleUrls: ['./modal-buscar-cotizacion.component.scss']
})
export class ModalBuscarCotizacionComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('third_party_id') third_party_id;
  @Input('business_id') business_id;
  @Input('person_id') person_id;
  @Input('create') create: boolean;
  @Output('update') update = new EventEmitter();
  form_filters_quotations: FormGroup;
  loadingQuotation: boolean;
  quotations: any[] = [];
  cotizacionesSeleccionadas: any[] = [];
  paginationQuotations: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocio: NegociosService,
    private _quotation: QuotationService,
    private _swal: SwalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    if (this.third_party_id) {
      this._modal.open(this.modal, 'xl');
      this.createFormFiltersQuotations();
      this.getQuotations();
    } else {
      this._swal.show({
        icon: 'info',
        title: 'Atención',
        text: 'Selecciona un tercero para continuar.',
        showCancel: false
      })
    }
  }

  createFormFiltersQuotations() {
    this.form_filters_quotations = this.fb.group({
      city: '',
      code: '',
      client: '',
      description: '',
      line: '',
    })
    this.form_filters_quotations.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getQuotations();
    })
  }

  getQuotations(page = 1) {
    this.cotizacionesSeleccionadas = []
    this.paginationQuotations.page = page;
    let params = {
      ...this.paginationQuotations,
      ...this.form_filters_quotations.value,
      third_party_id: this.third_party_id
    }
    this.loadingQuotation = true;
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.loadingQuotation = false;
      this.paginationQuotations.collectionSize = res.data.total;
    })
  }

  guardarCotizacion(item) {
    if (this.cotizacionesSeleccionadas.includes(item.id)) {
      this.cotizacionesSeleccionadas = this.cotizacionesSeleccionadas.filter(
        (cot) => cot !== item.id
      );
    }
    else {
      if (!this.create) {
        this.cotizacionesSeleccionadas.push({
          quotation_id: item.id,
          business_id: this.business_id,
          total_cop: item.total_cop
        });
      } else {
        this.cotizacionesSeleccionadas.push(item)
      }
    }
  }


  addCotizacion() {
    if (!this.create) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a agregar las cotizaciones seleccionadas'
      }).then(r => {
        if (r.isConfirmed) {
          let data = {
            business_id: this.business_id,
            quotations: this.cotizacionesSeleccionadas,
            person_id: this.person_id
          }
          this._negocio.newBusinessQuotation(data).subscribe(data => {
            this.update.emit();
            this.getQuotations();
            this._modal.close();
            this.cotizacionesSeleccionadas = [];
          });
        }
      })
    } else {
      this.update.emit(this.cotizacionesSeleccionadas);
      this._modal.close();
    }
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }
}
