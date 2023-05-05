import { DatePipe, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion, MatPaginatorIntl, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { DateAdapter } from 'saturn-datepicker';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ModalService } from 'src/app/core/services/modal.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { QuotationService } from './quotation.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})

export class CotizacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  datePipe = new DatePipe('es-CO');
  quotations: any;
  filtrosActivos: boolean = false
  quotations_cards: any;
  quotation: any;
  form_filters: FormGroup;
  loading: boolean;
  loading_cards: boolean;
  view_list: boolean;
  date: any;
  count_pendiente = 0;
  count_aprobada = 0;
  count_no_aprobada = 0;
  count_anulada = 0;
  orderObj: any
  paginacion: any
  filters = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  }
  permission: Permissions = {
    menu: 'Cotizaciones',
    permissions: {
      show: true
    }
  };
  constructor(
    private _quotations: QuotationService,
    private _swal: SwalService,
    private _modal: ModalService,
    public router: Router,
    private location: Location,
    private paginator: MatPaginatorIntl,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _permission: PermissionService,
    private dateAdapter: DateAdapter<any>,
    private _paginator: PaginatorService
  ) {
    this.dateAdapter.setLocale('es');
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap.subscribe((params: any) => {
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize
        } else {
          this.pagination.pageSize = 10
        }
        if (params.params.pag) {
          this.pagination.page = params.params.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params.keys, ...params }
        if (Object.keys(this.orderObj).length > 3) {
          this.filtrosActivos = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.form_filters.patchValue(formValues['params']);
        }
        this.getQuotation();
        this.getQuotationsCards();
      }
      );
    } else {
      this.router.navigate(['/notauthorized'])
    }

  }

  stop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.form_filters.patchValue({
        date_start: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.form_filters.patchValue({
        date_start: '',
        date_end: ''
      })
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      date: '',
      date_start: '',
      date_end: '',
      city: '',
      code: '',
      client: '',
      description: '',
      status: '',
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getQuotation();
    })
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.form_filters);
    this.filtrosActivos = false
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  openList(id) {
    this.view_list = true;
    this.quotation = this.quotations.find(q => q.id === id);
    this.quotations.forEach(q => q.selected = (q.id === id));
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getQuotation()
  }

  closeList() {
    this.view_list = false;
    this.quotations.forEach(q => q.selected = false);
  }

  updateStatus(status, id) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: ''
    }).then((r) => {
      if (r.isConfirmed) {
        let data = {
          status: status
        }
        this._quotations.updateQuotation(data, id).subscribe((res: any) => {
          this._swal.show({
            icon: 'success',
            text: '',
            title: res.data,
            showCancel: false,
            timer: 1000
          })
          this.getQuotation(id);

          this.getQuotationsCards();
        })
      }
    })
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.form_filters);
  }

  getQuotation(id = null) {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/cotizacion', paramsurl.toString());
    this._quotations.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getQuotation()
      }
      if (this.view_list) {
        this.openList(id)
      }

    })

  }

  getQuotationsCards() {
    this.count_pendiente = 0;
    this.count_anulada = 0;
    this.count_aprobada = 0;
    this.count_no_aprobada = 0;
    this.loading_cards = true;
    this._quotations.getAllQuotations()
      .subscribe((res: any) => {
        this.loading_cards = false;
        this.quotations_cards = res.data
        this.quotations_cards.forEach(element => {
          if (element.status == 'Pendiente') {
            this.count_pendiente++;
          } else if (element.status == 'Aprobada') {
            this.count_aprobada++
          } else if (element.status == 'No aprobada') {
            this.count_no_aprobada++
          } else if (element.status == 'Anulada') {
            this.count_anulada++
          }
        });
      })
  }

  comments_quotation(content, id) {
    this._modal.open(content)
  }

}
