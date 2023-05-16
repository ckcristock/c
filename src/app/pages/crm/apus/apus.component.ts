import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ApusService } from './apus.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { CurrencyMaskInputMode } from 'ngx-currency';
import { consts } from 'src/app/core/utils/consts';
import { PaginatorService } from 'src/app/core/services/paginator.service';
@Component({
  selector: 'app-apus',
  templateUrl: './apus.component.html',
  styleUrls: ['./apus.component.scss']
})
export class ApusComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  form_filters: FormGroup;
  checkTipo: boolean = true
  date: any;
  checkNombre: boolean = true
  checkCliente: boolean = true
  checkDestino: boolean = true
  checkLinea: boolean = true
  checkQuien: boolean = true
  checkFecha: boolean = true
  apus: any[] = [];
  loading: boolean = false;
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  }
  permission: Permissions = {
    menu: 'APU',
    permissions: {
      show: true
    }
  };
  constructor(
    private _apus: ApusService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private router: Router,
    private _permission: PermissionService,
    private _paginator: PaginatorService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.dateAdapter.setLocale('es');
    this.permission = this._permission.validatePermissions(this.permission)
  }
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any

  masksInput = consts;
  ngOnInit(): void {
    if (this.permission?.permissions?.show) {
      this.createFormFilters();
      this.route?.queryParamMap.subscribe((params: any) => {
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize
        } else {
          this.pagination.pageSize = localStorage.getItem('paginationItemsAPU') || 100
        }
        if (params.params.pag) {
          this.pagination.page = params.params.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params.keys, ...params };
        if (Object.keys(this.orderObj).length > 3) {
          this.filtrosActivos = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.form_filters.patchValue(formValues['params']);
        }
        let date_one = new Date(this.form_filters.controls.date_one.value)
        let date_two = new Date(this.form_filters.controls.date_two.value)
        date_one.setDate(date_one.getDate() + 1)
        date_two.setDate(date_two.getDate() + 1)
        this.date = { begin: date_one, end: date_two }
        this.getApus()
      }
      );
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      code: '',
      date_one: '',
      date_two: '',
      name: '',
      city: '',
      client: '',
      line: '',
      type: '',
      description: '',
      set_name: '',
      machine_name: ''
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getApus();
    })
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.form_filters.patchValue({
        date_one: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_two: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.form_filters.patchValue({
        date_one: '',
        date_two: ''
      })
    }
    this.getApus();
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.form_filters)
    this.filtrosActivos = false
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage.setItem('paginationItemsAPU', this.pagination.pageSize);
    this.getApus()
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.form_filters)
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  getApus() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/apus', paramsurl.toString());
    this._apus.getApus(params).subscribe((r: any) => {
      this.apus = r.data.data;
      this.loading = false;
      this.paginationMaterial = r.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getApus()
      }
    })
  }

}
