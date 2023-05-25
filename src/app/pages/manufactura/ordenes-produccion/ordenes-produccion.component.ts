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
import { PaginatorService } from './../../../core/services/paginator.service';
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
  datePipe = new DatePipe('es-CO');
  workOrders: any[] = []
  loading: boolean;
  date: any;
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
  paginationMaterial: any;
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
    private _swal: SwalService,
    private _paginator: PaginatorService
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap.subscribe((params: any) => {
        this._paginator.checkParams(this.pagination, params, 'paginationOrdenesPoduccion');
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

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage?.setItem('paginationOrdenesPoduccion', this.pagination?.pageSize);
    this.getWorkOrders()
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.formFilters)
    this.active_filters = false
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFilters)
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
      this.workOrders.forEach(async workOrder => {
        const fechaCreacion = new Date(workOrder.created_at);
        const fechaEntrega = new Date(workOrder.expected_delivery_date);
        const fechaEntregaReal = new Date(workOrder.delivery_date);
        const estado = workOrder.status;
        workOrder.committed_days = this.calcularDiasEntrega(fechaCreacion, fechaEntrega);
        workOrder.delivery_days = await this.calcularDiferenciaFechas(fechaEntrega);
        workOrder.status_time = this.obtenerEstadoProyecto(estado, workOrder.delivery_days);
        workOrder.real_days = this.calcularDiferenciaFechas2(fechaEntregaReal, fechaCreacion);
      });
    })
  }

  calcularDiasEntrega(fechaCreacion: Date, fechaEntrega: Date): number | string {
    if (!fechaEntrega) {
      return 'NA';
    }
    const diffTime = Math.abs(fechaEntrega.getTime() - fechaCreacion.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  async calcularDiferenciaFechas(fechaEntrega: Date): Promise<string | number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fechaEntrega.getTime() > 0) {
      const diffTime = Math.abs(fechaEntrega.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return '';
  }

  calcularDiferenciaFechas2(fechaEntregaReal: Date | string, fechaCreacion: Date | string): number | string {
    if (fechaEntregaReal) {
      return 'N/A';
    }

    const fechaSValue = new Date(fechaEntregaReal);
    const fechaNValue = new Date(fechaCreacion);
    const differenceInDays = Math.floor((fechaSValue.getTime() - fechaNValue.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return differenceInDays;
  }

  obtenerEstadoProyecto(estado: string, diasRestantes: number): string {
    console.log(diasRestantes)
    if (estado === 'T') {
      return 'TERMINADO';
    }
    if (estado === 'A') {
      return 'NA';
    }
    if (diasRestantes > 0) {
      return 'A TIEMPO';
    }
    if (diasRestantes <= 0) {
      return 'RETRASADO';
    }
    return '';
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
    let param = { status: status }
    this._work_orders.updateWorkOrder(id, param).subscribe();
  }
}



