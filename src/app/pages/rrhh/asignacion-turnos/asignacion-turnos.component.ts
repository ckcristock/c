import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { AsignacionTurnosService } from './asignacion-turnos.service';
import { RotatingTurnService } from '../../ajustes/informacion-base/turnos/turno-rotativo/rotating-turn.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe, Location } from '@angular/common';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MatAccordion } from '@angular/material/expansion';
import { User } from 'src/app/core/models/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DateAdapter } from 'saturn-datepicker';
import { UserService } from 'src/app/core/services/user.service';
import { PageEvent } from '@angular/material';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-asignacion-turnos',
  templateUrl: './asignacion-turnos.component.html',
  styleUrls: ['./asignacion-turnos.component.scss'],
})
export class AsignacionTurnosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  changeWeek = new EventEmitter<any>();

  datePipe = new DatePipe('es-CO');
  loading: boolean;
  matPanel: boolean;
  date: any;
  estadoFiltros = false;
  formFilters: FormGroup;
  orderObj: any
  active_filters: boolean = false
  permission: Permissions = {
    menu: 'Asignación de turnos',
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

  groupList: any[];
  dependencyList: any[] = [];
  datosGenerales: any[] = [];
  turns: any[] = [];
  diaInicialSemana = moment().startOf('week');//revisar estos, y posiblemente eliminar
  diaFinalSemana = moment().endOf('week');//se está usando en el formFilter
  startWeek: any
  endWeek: any;

  constructor(
    private _asignacion: AsignacionTurnosService,
    private _rotatingTurn: RotatingTurnService,
    private _groups: GroupService,
    private _dependencies: DependenciesService,

    private fb: FormBuilder,
    private dateAdapter: DateAdapter<any>,
    private _permission: PermissionService,
    private location: Location,
    private _user: UserService,
    private route: ActivatedRoute,
    public router: Router,
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

        if (Object.keys(this.orderObj).length > 2) {
          this.active_filters = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
        }
      });//aqui
      this.startWeek = moment().startOf('week').toDate()
      this.endWeek = moment().endOf('week').toDate()
      this.createFormFilters();
      this.getTurns();
      this.getGrpups();
      this.getData();
    } else {
      this.router.navigate(['/notautorized']);
    }
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }
  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getData()
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
      week: [moment().format(moment.HTML5_FMT.WEEK)],
      /* company_id: [1], */
      group_id: [''],
      dependency_id: [''],
      person: [''],
      date_from: [''],
      date_to: [''],
    });

    this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: 0 });
        this.formFilters.get('dependency_id').disable();
      }
    });
  }

  selectedDate(fecha) {
    this.loading = true
    if (fecha.value) {
      this.formFilters.patchValue({
        date_from: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_to: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
      this.diaInicialSemana = moment(this.formFilters.controls.date_from.value);
      this.diaFinalSemana = moment(this.formFilters.controls.date_to.value);
    } else {
      this.formFilters.patchValue({
        date_from: '',
        date_to: ''
      });
    }
    this.getData()
    this.loading = false
  }

  getData() {  ///  rrhh/turnos/asignacion
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/turnos/asignacion', paramsurl.toString());
    const fecha_ini = this.formFilters.controls.date_from.value == ''
      //? moment().format('YYYY-MM-DD')
      ? moment().startOf('week')
      : this.formFilters.controls.date_from.value
    const fecha_fin = this.formFilters.controls.date_to.value == ''
      //? moment().format('YYYY-MM-DD')
      ? moment().endOf('week')
      : this.formFilters.controls.date_to.value

    this._asignacion.getPeople(fecha_ini, params).subscribe((r: any) => {
      this.datosGenerales = r.data;
      this.loading = false;
      setTimeout(() => {
        this.changeWeek.emit({
          diaInicialSemana: fecha_ini,
          diaFinalSemana: fecha_fin,
        });
        //this.changeWeek.emit();
      }, 200);
    });
  }

  getGrpups() {
    this._groups.getGroup().subscribe((r: any) => {
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
  getTurns() {
    this._rotatingTurn.getAllSelect().subscribe((r: any) => {
      this.turns = r;
    });
  }

  /**
   * revisar, la idea es que funcione con el formulario y no con la variable
   * El emiter lo anvía al padre
   */
  makeRequestBySemana() {
    /* let semana = this.formFilters.get('week').value;
    this.diaInicialSemana = moment(semana).startOf('week');
    this.diaFinalSemana = moment(semana).endOf('week');
    this.startWeek = moment(semana).startOf('week').toDate()
    this.endWeek = moment(semana).endOf('week').toDate()
    this.changeWeek.emit({
      diaInicialSemana: this.diaInicialSemana,
      diaFinalSemana: this.diaFinalSemana
    }); */
    this.getData()
  }

  descargarInformeTurnos(turno) { }

  /* getData() {  ///  rrhh/turnos/asignacion
    this.loading = true;
    this._asignacion
      .getPeople(this.diaInicialSemana, this.formFilters.value)
      .subscribe((r: any) => {
        this.datosGenerales = r.data;
        this.loading = false;
        setTimeout(() => {
          this.changeWeek.emit({
            diaInicialSemana: this.diaInicialSemana,
            diaFinalSemana: this.diaFinalSemana,
          });
          // this.changeWeek.emit();
        }, 200);
      });
  } */

}
