import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion, MatPaginatorIntl, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ModalService } from 'src/app/core/services/modal.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { QuotationService } from './quotation.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})

export class CotizacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  quotations: any;
  filtrosActivos: boolean = false
  quotations_cards: any;
  quotation: any;
  form_filters: FormGroup;
  loading: boolean;
  loading_cards: boolean;
  view_list: boolean;
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
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
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
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params }
          if (Object.keys(this.orderObj).length > 2) {
            this.filtrosActivos = true
            const formValues = {};
            for (const param in params) {
              formValues[param] = params[param];
            }
            this.form_filters.patchValue(formValues['params']);
          }
          if (this.orderObj.params.pag) {
            this.getQuotation(this.orderObj.params.pag);
            this.getQuotationsCards();
          } else {
            this.getQuotation();
            this.getQuotationsCards();
          }
        }
        );
    } else {
      this.router.navigate(['/notauthorized'])
    }

  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      date: '',
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
      //this.getQuotationsCards();
    })
  }

  resetFiltros() {
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
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
    this.getQuotation(event.pageIndex + 1)
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
          this.getQuotation(1, id);

          this.getQuotationsCards();
        })
      }
    })
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    for (const controlName in this.form_filters.controls) {
      const control = this.form_filters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  getQuotation(page = 1, id = null) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/cotizacion', paramsurl.toString());
    this._quotations.getQuotations(params)
      .subscribe((res: any) => {
        this.quotations = res.data.data;
        this.paginacion = res.data
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
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
