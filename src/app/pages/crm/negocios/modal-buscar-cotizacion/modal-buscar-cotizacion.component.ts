import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NegociosService } from '../negocios.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { debounceTime } from 'rxjs/operators';
import { QuotationService } from '../../cotizacion/quotation.service';
import { Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material';
import { PaginatorService } from 'src/app/core/services/paginator.service';

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
  datePipe = new DatePipe('es-CO');
  quotations: any[] = [];
  cotizacionesSeleccionadas: any[] = [];
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: localStorage.getItem('paginationItemsQuotation') || 100,
  }
  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocio: NegociosService,
    private _quotation: QuotationService,
    private _swal: SwalService,
    private router: Router,
    private _paginator: PaginatorService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    if (this.third_party_id) {
      this.cotizacionesSeleccionadas = []
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

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage.setItem('paginationItemsQuotation', this.pagination.pageSize);
    this.getQuotations()
  }

  createFormFiltersQuotations() {
    this.form_filters_quotations = this.fb.group({
      date: '',
      date_start: '',
      date_end: '',
      city: '',
      code: '',
      client: '',
      description: '',
    })
    this.form_filters_quotations.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getQuotations();
    })
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.form_filters_quotations.patchValue({
        date_start: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.form_filters_quotations.patchValue({
        date_start: '',
        date_end: ''
      })
    }
  }

  getQuotations() {
    this.loadingQuotation = true;
    let params = {
      ...this.pagination,
      ...this.form_filters_quotations.value,
      third_party_id: this.third_party_id
    }
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.quotations.forEach(quot => {
        this.cotizacionesSeleccionadas.forEach(cot => {
          if ((this.create ? cot.id : cot.quotation_id) == quot.id) {
            quot.selected = true
          }
        });
      });
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getQuotations()
      }
      this.loadingQuotation = false;
    })
  }

  guardarCotizacion(item, event) {
    const index = this.cotizacionesSeleccionadas.findIndex(x => ((this.create ? x.id : x.quotation_id) === item.id));
    if (item.selected) {
      if (index === -1) {
        if (!this.create) {
          this.cotizacionesSeleccionadas.push({
            quotation_id: item.id,
            business_id: this.business_id,
            total_cop: item.total_cop
          });
        } else {
          this.cotizacionesSeleccionadas.push(item)
        }
        item.selected = true
      }
    } else {
      if (index !== -1) {
        this.cotizacionesSeleccionadas.splice(index, 1);
        item.selected = false
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
          this._negocio.newBusinessQuotation(data).subscribe((res: any) => {
            this.update.emit();
            this.getQuotations();
            this._modal.close();
            this.cotizacionesSeleccionadas = [];
            this._swal.show({
              icon: 'success',
              title: 'Cotizaciones agregadas',
              text: res.data,
              showCancel: false
            })
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
