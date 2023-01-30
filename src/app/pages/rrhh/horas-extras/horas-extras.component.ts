import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ExtraHoursService } from './extra-hours.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe, Location } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/users.model';
import { PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss'],
})
export class HorasExtrasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  datePipe = new DatePipe('es-CO');
  loading: boolean;
  matPanel: boolean;
  date: any;
  estadoFiltros = false;
  formFilters: FormGroup;
  orderObj: any
  active_filters: boolean = false
  permission: Permissions = {
    menu: 'Validación horas extras',
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

  primerDiaSemana = moment().startOf('week').format('YYYY-MM-DD');
  ultimoDiaSemana = moment().endOf('week').format('YYYY-MM-DD');
  semana = moment().format(moment.HTML5_FMT.WEEK);
  horasExtras: any[] = [];
  diasSemanaActual: any[] = [];
  turnType = 'Rotativo';
  people_id = '';
  people: any;

  constructor(
    private _extraHours: ExtraHoursService,
    private _people: PersonService,

    private dateAdapter: DateAdapter<any>,
    private _permission: PermissionService,
    private location: Location,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
  ) {
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

    this.getPeople();
    this.getPerson();
    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  openClose(){
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getPeople()
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
      people_id: [''],
      date_from: [''],
      date_to: [''],
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getPeople();
    })
    //Falta chequear la relación entre los filtros para establecer las peticiones al cambiar la seleccion
   /*  this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        //this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: 0 });
        this.formFilters.get('dependency_id').disable();
      }
    }); */
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.formFilters.patchValue({
        date_from: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_to: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
      this.primerDiaSemana = this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd');
      this.ultimoDiaSemana = this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    } else {
      this.formFilters.patchValue({
        date_from: '',
        date_to: ''
      });
    }
    this.getPeople()
  }

  getPerson() {
    this._people.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }

  getPeople() {  ///rrhh/turnos/horas-extras
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/turnos/horas-extras', paramsurl.toString());
    //let params = { person_id: this.people_id ? this.people_id : '' };
    const fecha_ini = this.formFilters.controls.date_from.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_from.value
    const fecha_fin = this.formFilters.controls.date_to.value == ''
        ? moment().format('YYYY-MM-DD')
        : this.formFilters.controls.date_to.value
    this._extraHours
      .getPeople(
        fecha_ini,
        fecha_fin,
        //this.turnType,
        this.formFilters.controls.turn_type.value,
        params
      )
      .subscribe((r: any) => {
        this.loading = false;
        this.horasExtras = r.data;
      });
  }
}
