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
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
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
    private dateAdapter: DateAdapter<any>
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.dateAdapter.setLocale('es');
    this.permission = this._permission.validatePermissions(this.permission)
  }
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params };
          if (Object.keys(this.orderObj).length > 2) {
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

          if (this.orderObj.params.pag) {
            this.getApus(this.orderObj.params.pag);
          } else {
            this.getApus()
          }

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
      description: ''
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
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
    this.filtrosActivos = false
  }

  handlePageEvent(event: PageEvent) {
    this.getApus(event.pageIndex + 1)
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
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }
  getApus(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/apus', paramsurl.toString());
    this.loading = true;
    this._apus.getApus(params).subscribe((r: any) => {
      this.apus = r.data.data;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
