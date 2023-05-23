import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { ReporteErroresService } from './reporte-errores.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { Location } from '@angular/common';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-reporte-errores',
  templateUrl: './reporte-errores.component.html',
  styleUrls: ['./reporte-errores.component.scss']
})
export class ReporteErroresComponent implements OnInit {

  formFilters: FormGroup;
  people: any[] = [];
  filteredPeople: any[] = [];
  errorsReports: any[] = [];
  date = new Date();
  paginationMaterial: any;
  orderObj: any;
  active_filters: boolean;
  loading: boolean = false;
  permission: Permissions = {
    menu: 'Errores de asistencia',
    permissions: {
      show: true,
    }
  };
  pagination: any = {
    page: '',
    pageSize: '',
  }

  constructor(
    private fb: FormBuilder,
    private _people: PersonService,
    public router: Router,
    private route: ActivatedRoute,
    private _errorsReport: ReporteErroresService,
    private _permission: PermissionService,
    private _paginator: PaginatorService,
    private location: Location,
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    if (this.permission.permissions.show) {
      this.createFormFilters();
      await this.getPeople();
      this.route.queryParamMap.subscribe((params: any) => {
        this._paginator.checkParams(this.pagination, params, 'paginationErroresAsistencia')
        this.orderObj = { ...params.keys, ...params }
        if (Object.keys(this.orderObj).length > 4) {
          this.active_filters = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
        }
        this.paginate();
      })
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  paginate() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    let paramsurl = this.setFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/asistencia-errores', paramsurl.toString());
    this._errorsReport.paginate(params).subscribe((res: any) => {
      this.errorsReports = res.data.data
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.paginate()
      }
    })
  }

  setFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFilters)
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage?.setItem('paginationErroresAsistencia', this.pagination?.pageSize);
    this.paginate()
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.formFilters)
    this.date = undefined
    this.active_filters = false
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      date: this.date.toISOString().slice(0, 10),
      person_id: '',
    })
    this.formFilters.valueChanges.subscribe(() => {
      this.paginate();
    })
  }

  selectedDate(event) {
    this.formFilters.patchValue({
      date: event.value ? event.value.toISOString().slice(0, 10) : ''
    })
  }

  async getPeople() {
    await this._people.getPeopleIndex().toPromise().then((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
      this.filteredPeople = this.people.slice();
    });
  }

}
