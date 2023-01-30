import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatExpansionPanel, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { DisenoService } from '../services/diseno.service';

@Component({
  selector: 'app-diseno',
  templateUrl: './diseno.component.html',
  styleUrls: ['./diseno.component.scss']
})
export class DisenoComponent implements OnInit, OnDestroy {
  @ViewChild('matPanel') matPanel: MatExpansionPanel;
  loading: boolean;
  paginationMaterial: any;
  work_orders: any[] = [];
  formFilters: FormGroup;
  orderObj: any;
  active_filters: boolean = false;
  interval;
  pagination: any = {
    page: '',
    pageSize: '',
  }
  permission: Permissions = {
    menu: 'Diseño',
    permissions: {
      show: true
    }
  };

  constructor(
    private _work_order_design: DisenoService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private route: ActivatedRoute,
    private location: Location,
    public router: Router,
    public _user: UserService,
    private _permission: PermissionService,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
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
    this.matPanel.toggle();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getWorkOrders();
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
      status: '',
      person_id: this._user.user.person.id
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
    this.location.replaceState('/manufactura/diseño', paramsurl.toString());
    this._work_order_design.getWorkOrdersDesign(params).subscribe((r: any) => {
      this.work_orders = r.data.data;
      this.paginationMaterial = r.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getWorkOrders()
      }
      this.interval = setInterval(() => {
        this.work_orders.forEach(wo => {
          wo.duration = this.getTime(wo);
        });
      }, 1000)
      this.loading = false;
    })
  }

  getTime(item) {
    if (item.start_time && !item.end_time) {
      let now = new Date();
      let start_time = new Date(item.start_time);
      return this.difference(now, start_time)
    } else if (item.start_time && item.end_time) {
      let end_time = new Date(item.end_time);
      let start_time = new Date(item.start_time);
      return this.difference(end_time, start_time)
    } else {
      return 'No aplica'
    }
  }

  difference(d1, d2) {
    var seconds = Math.floor((d1.getTime() - (d2.getTime())) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);
    hours = hours - (days * 24);
    minutes = minutes - (days * 24 * 60) - (hours * 60);
    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
    return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
  }

}
