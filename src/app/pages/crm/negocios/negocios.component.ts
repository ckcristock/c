import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Negocio } from './negocio.interface';
import { NegociosService } from './negocios.service';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { MatPaginatorIntl, PageEvent } from '@angular/material';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { HttpParams } from '@angular/common/http';
import { PaginatorService } from 'src/app/core/services/paginator.service';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  form: FormGroup;
  formFiltersBusiness: FormGroup;
  datePipe = new DatePipe('es-CO');
  business: any[] = [];
  date: any;
  negocios_quinta_etapa: Negocio[];
  negocios_cuarta_etapa: Negocio[];
  negocios_tercera_etapa: Negocio[];
  negocios_segunda_etapa: Negocio[];
  negocios_primera_etapa: Negocio[];

  filtrosActivos: boolean = false
  orderObj: any
  loading: boolean;
  active = 1;

  total = {
    first: 0,
    second: 0,
    third: 0,
    quarter: 0,
    fifth: 0
  };

  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
  }

  permission: Permissions = {
    menu: 'Negocios',
    permissions: {
      show: true
    }
  };

  constructor(
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private _modal: ModalService,
    private paginator: MatPaginatorIntl,
    private _permission: PermissionService,
    private _paginator: PaginatorService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  async ngOnInit(): Promise<void> {
    if (this.permission.permissions.show) {
      this.createFormFiltersBusiness();
      await this.route.queryParamMap.subscribe(async (params: any) => {
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize
        } else {
          this.pagination.pageSize = 100
        }
        if (params.params.pag) {
          this.pagination.page = params.params.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params.keys, ...params };
        if (Object.keys(this.orderObj).length > 3) {
          this.filtrosActivos = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFiltersBusiness.patchValue(formValues['params']);
        }
        let date_one = new Date(this.formFiltersBusiness.controls.date_start.value)
        let date_two = new Date(this.formFiltersBusiness.controls.date_end.value)
        date_one.setDate(date_one.getDate() + 1)
        date_two.setDate(date_two.getDate() + 1)
        this.date = { begin: date_one, end: date_two }
        await this.getNegocios();
      }
      );
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFiltersBusiness)
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.formFiltersBusiness);
    this.filtrosActivos = false
  }
  //!
  paginacion: any

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getNegocios()
  }

  createFormFiltersBusiness() {
    this.formFiltersBusiness = this.fb.group({
      code: '',
      name: '',
      company_name: '',
      date_start: '',
      date_end: '',
      status: '',
    });
    this.formFiltersBusiness.valueChanges.pipe(debounceTime(500)).subscribe(r => {
      this.getNegocios()
    })
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.formFiltersBusiness.patchValue({
        date_start: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFiltersBusiness.patchValue({
        date_start: '',
        date_end: ''
      });
    }
  }

  changeUrl(url) {
    this.location.replaceState('/crm/negocios', url);
  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'xl')
  }

  async getNegocios() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFiltersBusiness.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/negocios', paramsurl.toString());
    await this._negocios.getBusinesses(params).toPromise().then((resp: any) => {
      this.loading = false;
      this.business = resp.data.data;
      this.paginacion = resp.data
      this.paginationMaterial = resp.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getNegocios()
      }
      this.getLists();
      this.calcularTotal();
    });
  }

  /**
   * Detecta cuando se suelta un elemento y se elimina de la lista actual
   */
  onDragged(item: any, list: any[]) {
    const index = list.indexOf(item);
    list.splice(index, 1);
    this.calcularTotal();
  }

  /**
   * Detecta cuando se suelta un Elemento, y se agrega a la nueva lista actual
   */
  onDrop(event: any, filteredList?: any[], targetStatus?: string) {
    event.data.status = targetStatus ? targetStatus : '';
    if (filteredList && event.dropEffect === 'move') {
      let index = event.index;
      if (typeof index === 'undefined') {
        index = filteredList.length;
      }
      filteredList.splice(index, 0, event.data);
      this._negocios.changeState({ status: targetStatus }, event.data.id).subscribe();
    }
  }

  private getLists() {
    setTimeout(() => {
      this.negocios_primera_etapa = this.business.filter(
        (t) => t.status === 'Prospección'
      );
      this.negocios_segunda_etapa = this.business.filter(
        (t) => t.status === 'Presupuesto'
      );
      this.negocios_tercera_etapa = this.business.filter(
        (t) => t.status === 'Cotización'
      );
      this.negocios_cuarta_etapa = this.business.filter(
        (t) => t.status === 'Negociación'
      );
      this.negocios_quinta_etapa = this.business.filter(
        (t) => t.status === 'Adjudicación'
      );
    }, 1000);

  }

  calcularTotal() {
    this.total = {
      first: 0,
      second: 0,
      third: 0,
      quarter: 0,
      fifth: 0
    };
    this.negocios_primera_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.first += el.budget.total_cop;
      });
    });
    this.negocios_segunda_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.second += el.budget.total_cop;
      });
    });
    this.negocios_tercera_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.third += el.budget.total_cop;
      });
    });
    this.negocios_cuarta_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.quarter += el.budget.total_cop;
      });
    });
    this.negocios_quinta_etapa?.forEach((neg: Negocio) => {
      neg.business_budget.forEach(el => {
        this.total.fifth += el.budget.total_cop;
      });
    });
  }

}
