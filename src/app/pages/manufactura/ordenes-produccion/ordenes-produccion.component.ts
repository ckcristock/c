import { DatePipe, Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion, PageEvent, TooltipComponent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { DateAdapter } from 'saturn-datepicker';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { OrdenesProduccionService } from '../services/ordenes-produccion.service';
Object.defineProperty(TooltipComponent.prototype, 'message', {
  set(v: any) {
    const el = document.querySelectorAll('.mat-tooltip');

    if (el) {
      el[el.length - 1].innerHTML = v;
    }
  },
});
@Component({
  selector: 'app-ordenes-produccion',
  templateUrl: './ordenes-produccion.component.html',
  styleUrls: ['./ordenes-produccion.component.scss']
})
export class OrdenesProduccionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  datePipe = new DatePipe('es-CO');
  date: any;
  matPanel: boolean;
  loading: boolean;
  paginationMaterial: any;
  workOrders: any[] = []
  formFilters: FormGroup;
  orderObj: any
  active_filters: boolean = false
  permission: Permissions = {
    menu: 'Órdenes de producción',
    permissions: {
      show: true,
      add: true
    }
  };
  pagination: any = {
    page: '',
    pageSize: '',
  }
  constructor(
    private _permission: PermissionService,
    public router: Router,
    private fb: FormBuilder,
    private _work_orders: OrdenesProduccionService,
    private route: ActivatedRoute,
    private location: Location,
    private dateAdapter: DateAdapter<any>,
    private _swal: SwalService
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    this.dateAdapter.setLocale('es');
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
        if (Object.keys(this.orderObj).length > 4) {
          this.active_filters = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
        }
        this.getWorkOrders();
      })
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getWorkOrders()
  }

  resetFiltros() {
    for (const controlName in this.formFilters.controls) {
      this.formFilters.get(controlName).setValue('');
    }
    this.active_filters = false
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    params = params.set('pageSize', this.pagination.pageSize)
    for (const controlName in this.formFilters.controls) {
      const control = this.formFilters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      code: '',
      start_date: '',
      end_date: '',
      city: '',
      client: '',
      description: '',
      observation: '',
      start_delivery_date: '',
      end_delivery_date: '',
      status: 'todos_sin_terminadas'
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getWorkOrders();
    })
  }

  getWorkOrders() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/manufactura/ordenes-produccion', paramsurl.toString());
    this._work_orders.getWorkOrders(params).subscribe((res: any) => {
      this.workOrders = res.data.data;
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getWorkOrders()
      }
    })
  }

  selectedDate(fecha, type_date) {
    if (type_date == 'date') {
      if (fecha.value) {
        this.formFilters.patchValue({
          date_start: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
          date_end: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
        })
      } else {
        this.formFilters.patchValue({
          date_start: '',
          date_end: ''
        })
      }
    } else if (type_date == 'delivery') {
      if (fecha.value) {
        this.formFilters.patchValue({
          start_delivery_date: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
          end_delivery_date: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
        })
      } else {
        this.formFilters.patchValue({
          start_delivery_date: '',
          end_delivery_date: ''
        })
      }
    }
  }

  updateStatus(status, id) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: (status == 'inicial' ? '¡La orden de producción será desactivada!' : '¡La orden de producción será activada!'),
    }).then((result) => {
      if (result.isConfirmed) {
        this._swal.show({
          icon: 'success',
          title: (status == 'anulada' ? '¡Orden de producción desactivada!' : 'Orden de producción activada!'),
          text: (status == 'anulada' ? 'La orden de producción ha sido activada con éxito.' : 'La orden de producción ha sido desactivada con éxito.'),
          timer: 1000,
          showCancel: false
        })
        this.getWorkOrders()
      }
    })
    let param = {status: status}
    this._work_orders.updateWorkOrder(id, param).subscribe();
  }
}
