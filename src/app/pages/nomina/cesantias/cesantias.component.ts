import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MatAccordion } from '@angular/material/expansion';
import { CesantiasService } from './cesantias.service';
import { DateAdapter } from 'saturn-datepicker';
import { debounceTime } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { HttpParams } from '@angular/common/http';
import { DatePipe, Location } from '@angular/common';
import { PaginatorService } from 'src/app/core/services/paginator.service';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss']
})
export class CesantiasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  datePipe = new DatePipe('es-CO');
  severancePaymentValid: boolean = false;
  severanceInterestPaymentValid: boolean = false;
  severancePayments: any[] = []
  loading: boolean = false;
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  }
  permission: Permissions = {
    menu: 'Cesantías',
    permissions: {
      show: true,
      add: true
    }
  };


  year = new Date().getFullYear();

  estadoFiltros: boolean = false;
  formFilters: FormGroup;
  activeFilters: boolean = false;
  orderObj: any;
  cesantiasList: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>,
    private _permission: PermissionService,
    private _modal: ModalService,
    private _swal: SwalService,
    private _paginate: PaginatorService,
    private _cesantias: CesantiasService,
    private location: Location,
  ) {
    this.dateAdapter.setLocale('es');
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.validPay();
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
          this.activeFilters = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
        }
      });
      this.getSeverancePayments()

    } else {
      this.router.navigate(['/notauthorized']);
    }
  }

  getSeverancePayments() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    const paramsUrl = this.setFiltros(this.pagination.page);
    let routePath = this.router.url.split('?')[0];
    this.location.replaceState(routePath, paramsUrl.toString());
    this._cesantias.getSeverancePaymentsPaginate(params).subscribe((res: any) => {
      this.severancePayments = res.data.data
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getSeverancePayments()
      }
    })
  }

  setFiltros(page: any) {
    return this._paginate.SetFiltros(page, this.pagination, this.formFilters)
  }

  validPay() {
    const today = new Date();
    const startJanuary = new Date(today.getFullYear(), 0, 1).getTime();
    const endJanuary = new Date(today.getFullYear(), 0, 31).getTime();
    const endFebruary = new Date(today.getFullYear(), 1, 14).getTime();
    this.severancePaymentValid = startJanuary <= today.getTime() && today.getTime() <= endJanuary;
    this.severanceInterestPaymentValid = startJanuary <= today.getTime() && today.getTime() <= endFebruary;
  }

  handlePageEvent(event: PageEvent) {
    this._paginate.handlePageEvent(event, this.pagination)
    this.getSeverancePayments()
  }

  resetFiltros() {
    this._paginate.resetFiltros(this.formFilters)
    this.activeFilters = false
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      people_id: [''],
      year: [''],
      type: [''],
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getSeverancePayments();
    })
  }

  redirect(type) {
    this.router.navigate(['/nomina/cesantias/', type, this.year])
  }

  severanceView(item) {
    let type = item.type == 'Pago a fondo de cesantías' ? 'pago' : 'intereses';
    this.router.navigate(['/nomina/cesantias/ver', type, item.id])
  }

}
