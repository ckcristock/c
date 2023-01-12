import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { DateAdapter } from 'saturn-datepicker';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { OrdenesProduccionService } from '../services/ordenes-produccion.service';

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
  workOrders: any[] = []
  formFilters: FormGroup;
  permission: Permissions = {
    menu: 'Órdenes de producción',
    permissions: {
      show: true,
      add: true
    }
  };
  constructor(
    private _permission: PermissionService,
    public router: Router,
    private fb: FormBuilder,
    private _work_orders: OrdenesProduccionService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.getWorkOrders();
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
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
      ...this.formFilters.value
    }
    this._work_orders.getWorkOrders(params).subscribe((res:any) => {
      this.workOrders = res.data.data;
      this.loading = false;
    })
    console.log('pruebas')
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
}
