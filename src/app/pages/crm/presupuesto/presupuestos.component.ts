import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { BudgetService } from './budget.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { debounceTime } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  form_filters: FormGroup;
  dateMat = null;
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
  checkItem: boolean = true
  checkFecha: boolean = true
  checkCliente: boolean = true
  checkDestino: boolean = true
  checkLinea: boolean = true
  checkQuien: boolean = true
  checkTCop: boolean = true
  checkTUsd: boolean = true
  loading = false
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any
  budgets: any[] = []
  permission: Permissions = {
    menu: 'Presupuesto',
    permissions: {
      show: true
    }
  };
  constructor(
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private _budget: BudgetService,
    private _person: PersonService,
    private fb: FormBuilder,
    private _permission: PermissionService,
    private router: Router,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.getPeople();
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
            this.dateMat = this.form_filters.get('date').value || ''
          }
          if (this.orderObj.params.pag) {
            this.getBudgets(this.orderObj.params.pag);
          } else {
            this.getBudgets()
          }

        }
        );
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  dateChange(e) {
    console.log(e)
    if (e.value) {
      this.form_filters.patchValue({
        date: new Date(e.value).toISOString()
      })
    } else {
      this.form_filters.patchValue({
        date: ''
      })
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      code: '',
      date: '',
      customer: '',
      municipality_id: '',
      line: '',
      person_id: ''
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getBudgets();
    })
  }

  people: any[] = []

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  resetFiltros() {
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
    this.filtrosActivos = false
  }

  handlePageEvent(event: PageEvent) {
    this.getBudgets(event.pageIndex + 1)
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

  getBudgets(page = 1): void {
    this.loading = true;

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/presupuesto', paramsurl.toString());
    this._budget.getAllPaginate(params).subscribe((r: any) => {
      this.budgets = r.data.data
      this.pagination.collectionSize = r.data.total;
      this.paginacion = r.data
      this.loading = false;

    })
  }

  getData(page = 1) {


    this.loading = true;
    /*  this._apuParts.apuPartPaginate(params).subscribe((r:any) => {
       this.apuParts = r.data.data;
       this.pagination.collectionSize = r.data.total;
       this.loading = false;
     }) */
  }

}
