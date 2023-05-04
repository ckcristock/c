import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { ModalService } from 'src/app/core/services/modal.service';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ConsecutivosService } from './consecutivos.service';

@Component({
  selector: 'app-consecutivos',
  templateUrl: './consecutivos.component.html',
  styleUrls: ['./consecutivos.component.scss']
})
export class ConsecutivosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  active_filters: boolean = false
  today = new Date();
  today_ = {
    anio: '',
    mes: '',
    dia: ''
  }
  consecutivo_numero;
  matPanel: boolean;
  form_filters: FormGroup;
  form: FormGroup;
  loading: boolean;
  paginationMaterial: any;
  id: number;
  titulo_consecutivo: string;
  orderObj: any
  consecutivos: any[] = [];
  pagination: any = {
    page: '',
    pageSize: '',
  }
  permission: Permissions = {
    menu: 'Consecutivos',
    permissions: {
      show: true
    }
  };

  constructor(
    private _permission: PermissionService,
    private _consecutivo: ConsecutivosService,
    public router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private _modal: ModalService,
    private _swal: SwalService

  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.today_.anio = this.today.toLocaleDateString('es', { year: '2-digit' })
      this.today_.mes = this.today.toLocaleDateString('es', { month: '2-digit' })
      this.today_.dia = this.today.toLocaleDateString('es', { day: '2-digit' })
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
          this.form_filters.patchValue(formValues['params']);
        }
        this.paginate();
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
    this.paginate()
  }

  paginate() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/ajustes/configuracion/consecutivos', paramsurl.toString());
    this._consecutivo.paginate(params).subscribe((res: any) => {
      this.consecutivos = res.data.data
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.paginate()
      }
    })
  }

  openModal(content, item) {
    this.titulo_consecutivo = item.Tipo
    this.id = item.Id_Comprobante_Consecutivo
    this.consecutivo_numero = item.Consecutivo.toString().padStart(item.longitud, 0)
    this._modal.open(content)
    this.form = this.fb.group({
      Prefijo: [item.Prefijo, [Validators.required, Validators.minLength(2), Validators.maxLength(6)]],
      longitud: [item.longitud, [Validators.required, Validators.pattern("^[0-9]*$"),]],
      format_code: [item.format_code],
      Anio: [item.Anio, Validators.required],
      Mes: [item.Mes, Validators.required],
      Dia: [item.Dia, Validators.required],
      city: [item.city, Validators.required],
    })
    this.form.get('longitud').valueChanges.subscribe(r => {
      this.consecutivo_numero = item.Consecutivo.toString().padStart(r, 0)
    })
  }

  saveConsecutivo() {
    if (!this.form.valid) {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Revisa los datos y vuelve a intentarlo',
        showCancel: false
      })
    } else {
      this._consecutivo.guardarConsecutivo(this.form.value, this.id).subscribe((r: any) => {
        this._swal.show({
          icon: 'success',
          title: 'Correcto',
          text: r.data,
          showCancel: false,
          timer: 1000
        })
        this._modal.close();
        this.paginate();
      })
    }
  }

  resetFiltros() {
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
    this.active_filters = false
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    params = params.set('pageSize', this.pagination.pageSize)
    for (const controlName in this.form_filters.controls) {
      const control = this.form_filters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      type: '',
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.paginate();
    })
  }

}
