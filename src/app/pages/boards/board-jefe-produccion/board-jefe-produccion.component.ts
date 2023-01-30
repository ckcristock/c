import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatExpansionPanel, PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { OrdenesProduccionService } from '../../manufactura/services/ordenes-produccion.service';
import { ProduccionService } from '../../manufactura/services/produccion.service';

@Component({
  selector: 'app-board-jefe-produccion',
  templateUrl: './board-jefe-produccion.component.html',
  styleUrls: ['./board-jefe-produccion.component.scss']
})
export class BoardJefeProduccionComponent implements OnInit, OnDestroy {
  @ViewChild('instance') instance: NgbTypeahead;
  @ViewChild('matPanel') matPanel: MatExpansionPanel;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  orderBy = 'asc';
  loading_stage: boolean;
  paginationMaterial: any;
  loading_assigned: boolean;
  work_orders: any[] = [];
  work_orders_assigned: any[] = [];
  people: any[] = []
  dependencies: any[] = []
  form_assign: FormGroup;
  formFilters: FormGroup;
  orderObj: any
  active_filters: boolean = false
  interval;
  pagination: any = {
    page: '',
    pageSize: '',
  }
  constructor(
    private _work_orders: OrdenesProduccionService,
    private _work_order_production: ProduccionService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _dependencies: DependenciesService,
    private _people: PersonService,
    private _swal: SwalService,
    private route: ActivatedRoute,
    private location: Location,
    public router: Router,
    public _user: UserService
  ) { }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  ngOnInit(): void {
    this.getInicial();
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
      this.getAssigned();
    })
  }

  openClose() {
    this.matPanel.toggle();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getAssigned();
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
      allocator_person_id: this._user.user.person.id
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getAssigned();
    })
  }

  openModal(content, item) {
    this.createFormAssign(item);
    this.getDependencies();
    this._modal.open(content, 'lg')
  }

  createFormAssign(item) {
    this.form_assign = this.fb.group({
      dependency_id: [12, Validators.required],
      work_order_id: [item.id],
      people: [null, Validators.required],
      observations: ['', [Validators.required, Validators.maxLength(500)]],
      hours: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0)]],
      minutes: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.min(0), Validators.max(59)]],
    })
    this.getPeople(this.form_assign.get('dependency_id').value)
    this.form_assign.get('dependency_id').valueChanges.subscribe(r => {
      this.form_assign.get('people').reset()
      this.getPeople(r);
    })
  }

  getPeople(dependency_id) {
    let params = {
      dependency_id: dependency_id
    }
    this._people.getPeopleIndex(params).subscribe((res: any) => {
      this.people = res.data
    })
  }

  getDependencies() {
    this._dependencies.getDependencies().subscribe((res: any) => {
      this.dependencies = res.data
    })
  }

  getInicial() {
    this.loading_stage = true;
    let params = {
      orderBy: this.orderBy,
      status: 'diseño'
    }
    this._work_orders.getForStage(params).subscribe((r: any) => {
      this.work_orders = r.data;
      this.loading_stage = false;
    })
  }

  getAssigned() {
    this.loading_assigned = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/', paramsurl.toString());
    this._work_order_production.getWorkOrdersProduction(params).subscribe((r: any) => {
      this.work_orders_assigned = r.data.data;
      this.paginationMaterial = r.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getAssigned()
      }
      this.interval = setInterval(() => {
        this.work_orders_assigned.forEach(wo => {
          wo.duration = this.getTime(wo);
        });
      }, 1000)
      this.loading_assigned = false;
    })
  } //esta cambia

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

  search_person: OperatorFunction<string, readonly { text; value }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.people.filter((v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );

  formatter_person = (x: { text: string }) => x.text;

  assign() {
    if (!this.form_assign.valid) {
      this.form_assign.markAllAsTouched()
      this._swal.show({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor revisa la información y vuelve a intentarlo',
        showCancel: false
      })
    } else {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a asignar esta orden de trabajo.'
      }).then(r => {
        if (r.isConfirmed) {
          this._work_order_production.assignDesign(this.form_assign.value).subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Correcto',
              text: r.data,
              showCancel: false,
            })
            this._modal.close();
            this.getInicial();
            this.getAssigned();
          })
        }
      })
    }
  }


}
