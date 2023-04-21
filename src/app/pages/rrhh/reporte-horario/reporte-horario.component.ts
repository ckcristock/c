import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';

import * as moment from 'moment';
import { ReporteHorarioService } from './reporte-horario.service';
import { CompanyService } from '../../ajustes/informacion-base/services/company.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe, Location } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/users.model';
import { PageEvent } from '@angular/material';
import { HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-reporte-horario',
  templateUrl: './reporte-horario.component.html',
  styleUrls: ['./reporte-horario.component.scss'],
})
export class ReporteHorarioComponent implements OnInit {
  datePipe = new DatePipe('es-CO');
  loading: boolean;
  date = new Date();
  estadoFiltros = false;
  formFilters: FormGroup;
  orderObj: any
  active_filters: boolean = false
  permission: Permissions = {
    menu: 'Reporte de horarios',
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
  user: User;

  reporteHorarios: any[] = [];
  groupList: any[] = [];
  dependencyList: any[] = [];
  companies: any[] = [];
  people: any[] = [];

  constructor(
    private _companies: CompanyService,
    private _grups: GroupService,
    private _dependencies: DependenciesService,
    private _reporteHorario: ReporteHorarioService,
    private _people: PersonService,

    private dateAdapter: DateAdapter<any>,
    private _permission: PermissionService,
    private location: Location,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    private _user: UserService,
  ) {
    this.user = _user.user;
    this.dateAdapter.setLocale('es');
    this.permission = this._permission.validatePermissions(this.permission);
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
      });//aqui
      this.getCompanies();
      this.getGroup();
      this.getPeople();
      this.getDiaries();

    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getDiaries()
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
      turn_type: ['Rotativo'],
      group_id: [''],
      dependency_id: [''],
      company_id: [1],
      person_id: [''],
      date_from: [''],
      date_to: [''],
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getDiaries();
    })
    this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: '' });
        this.formFilters.get('dependency_id').disable();
      }
    });
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.formFilters.patchValue({
        date_from: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_to: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFilters.patchValue({
        date_from: '',
        date_to: ''
      });
    }
    this.getDiaries()
  }

  getDiaries() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/turnos/reporte', paramsurl.toString());
    const fecha_ini = this.formFilters.controls.date_from.value == ''
      ? moment().format('YYYY-MM-DD')
      : this.formFilters.controls.date_from.value
    const fecha_fin = this.formFilters.controls.date_to.value == ''
      ? moment().format('YYYY-MM-DD')
      : this.formFilters.controls.date_to.value
    this._reporteHorario
      .getFixedTurnsDiaries(fecha_ini, fecha_fin, params)
      .subscribe((r) => {
        this.reporteHorarios = r.data;
        this.loading = false;
        //falta paginación, es necearia??
      });
  }

  getPeople() {
    this._people.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }
  getGroup() {
    this._grups.getGroup().subscribe((r: any) => {
      this.groupList = r.data;
      this.groupList.unshift({ value: '', text: 'Todos' });
    });
  }
  getDependencies(group_id) {
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencyList = r.data;
      this.dependencyList.unshift({ value: '', text: 'Todas' });
    });
  }
  getCompanies() {
    this.companies = this.user.person.companies.map(ele => ({ value: ele.id, text: ele.short_name }));
    this.formFilters.patchValue({
      company_id: 1
    })
    /* this._companies.getCompanies().subscribe((r: any) => {
      this.companies = r.data;
      this.companies.unshift({ value: 0, text: 'Todas' });
    }); */
  }

  get turn_type_value() {
    const turnType = this.formFilters.get('turn_type').value;
    console.log(turnType);
    if (turnType === 'Todos') { // Si se selecciona la opción "Todos"
      return ''; // Retorna un valor vacío para que se muestren todos los datos
    }
    return turnType; // De lo contrario, retorna el valor del campo de filtro
  }

  donwloading = false;
  download() {
    const fecha_ini = this.formFilters.controls.date_from.value == ''
      ? moment().format('YYYY-MM-DD')
      : this.formFilters.controls.date_from.value
    const fecha_fin = this.formFilters.controls.date_to.value == ''
      ? moment().format('YYYY-MM-DD')
      : this.formFilters.controls.date_to.value

    this.donwloading = true;

    this._reporteHorario
      .download(fecha_ini, fecha_fin, this.getForm())
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_llegadas_tarde';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloading = false;
      }),
      (error) => {
        console.log('Error downloading the file', error);
        this.donwloading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloading = false;
      };
  }

  getForm() {
    let form = this.formFilters.value;
    if (form.person_id == null) {
      delete form.person_id
    }
    return form
  }
}
