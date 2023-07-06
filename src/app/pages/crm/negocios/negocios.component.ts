import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.component.html',
  styleUrls: ['./negocios.component.scss'],
})
export class NegociosComponent implements OnInit {
  form: FormGroup;
  formFiltersBusiness: FormGroup;
  formFiltersGeneralView: FormGroup;
  datePipe = new DatePipe('es-CO');
  today = new Date();
  business: any[] = [];
  types: any[] = [];
  date: any;
  dateGeneralView: any;
  negocios_quinta_etapa: Negocio[];
  negocios_cuarta_etapa: Negocio[];
  negocios_tercera_etapa: Negocio[];
  negocios_segunda_etapa: Negocio[];
  negocios_primera_etapa: Negocio[];
  formType: FormGroup;
  bussinesTypes: any[] = [];
  loadingType: boolean;
  titleType = 'Nuevo';
  paginationTypes = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
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
    private _swal: SwalService,
    private paginator: MatPaginatorIntl,
    private _permission: PermissionService,
    private _paginator: PaginatorService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  async ngOnInit(): Promise<void> {
    if (this.permission?.permissions?.show) {
      this.createFormFiltersBusiness();
      this.createFormFiltersGeneralView();
      this.getTypes();
      await this.route.queryParamMap.subscribe(async (params: any) => {
        if (params?.params?.pageSize) {
          this.pagination.pageSize = params?.params?.pageSize
        } else {
          this.pagination.pageSize = localStorage.getItem('paginationItemsBusiness') || 100
        }
        if (params?.params?.pag) {
          this.pagination.page = params?.params?.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params?.keys, ...params };
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
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage.setItem('paginationItemsBusiness', this.pagination?.pageSize)
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
      business_type_id: '',
    });
    this.formFiltersBusiness.valueChanges.pipe(debounceTime(500)).subscribe(r => {
      this.getNegocios()
    })
  }

  createFormFiltersGeneralView() {
    let date_oneGV = new Date()
    let date_twoGV = new Date(date_oneGV.getFullYear(), date_oneGV.getMonth() - 1, date_oneGV.getDate());
    let date_one = this.datePipe?.transform(date_oneGV, 'yyyy-MM-dd');
    let date_two = this.datePipe?.transform(date_twoGV, 'yyyy-MM-dd')
    /* date_oneGV.setDate(date_oneGV.getDate() + 1)
    date_twoGV.setDate(date_twoGV.getDate() + 1) */
    this.dateGeneralView = { begin: date_twoGV, end: date_oneGV }
    console.log(date_one, date_two)
    this.formFiltersGeneralView = this.fb.group({
      date_start: date_two,
      date_end: date_one
    })
    this.formFiltersGeneralView.valueChanges.pipe(debounceTime(500)).subscribe(r => {
      this.getGeneralView()
    })
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.formFiltersBusiness.patchValue({
        date_start: this.datePipe.transform(fecha?.value?.begin?._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha?.value?.end?._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFiltersBusiness.patchValue({
        date_start: '',
        date_end: ''
      });
    }
  }

  selectedDateGV(fecha) {
    if (fecha.value) {
      this.formFiltersGeneralView.patchValue({
        date_start: this.datePipe.transform(fecha?.value?.begin?._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha?.value?.end?._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFiltersGeneralView.patchValue({
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

  openModal(content) {
    this._modal.open(content, 'md');
    this.createFormType();
    this.paginateType();
  }

  createFormType() {
    this.formType = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    })
    this.formType.get('name').valueChanges.subscribe(r => {
      if (!r) {
        this.formType.reset();
        this.titleType = 'Nuevo'
      }
    })
  }

  getTypes() {
    this._negocios.indexType().subscribe((res: any) => {
      this.types = res?.data;
    })
  }

  paginateType(page = 1) {
    this.paginationTypes.page = page;
    this.loadingType = true;
    this._negocios.paginateType(this.paginationTypes).subscribe((res: any) => {
      this.bussinesTypes = res?.data?.data;
      this.paginationTypes.collectionSize = res?.data?.total;
      this.loadingType = false;
    })
  }

  editTypes(item) {
    this.titleType = 'Editar'
    this.formType.patchValue({
      ...item
    })
  }

  saveType() {
    if (this.formType.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: this.titleType == 'Nuevo' ? 'Vamos a agregar un nuevo tipo' : 'Vamos a editar el tipo',
      }).then(r => {
        if (r.isConfirmed) {
          this._negocios.storeType(this.formType.value).subscribe((res: any) => {
            if (res.status) {
              this._swal.show({
                icon: 'success',
                title: res?.data,
                text: '',
                showCancel: false,
                timer: 1000
              })
              this.formType.reset();
              this.paginateType();
              this.titleType = 'Nuevo'
            } else {
              this._swal.hardError()
            }
          })
        }
      })
    } else {
      this._swal.incompleteError()
    }
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
      this.business = resp?.data?.data;
      this.paginacion = resp?.data
      this.paginationMaterial = resp?.data
      if (this.paginationMaterial?.last_page < this.pagination?.page) {
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
      this._negocios.changeState({ status: targetStatus }, event?.data?.id).subscribe();
    }
  }

  private getLists() {
    /* setTimeout(() => {
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
    }, 1000); */
  }
  generalView: any = [];
  prospectingStage = {
    budget_value: 0,
    quotation_value: 0,
    budget_value_usd: 0,
    quotation_value_usd: 0,
  };
  budgetStage = {
    budget_value: 0,
    quotation_value: 0,
    budget_value_usd: 0,
    quotation_value_usd: 0,
  };
  quotationStage = {
    budget_value: 0,
    quotation_value: 0,
    budget_value_usd: 0,
    quotation_value_usd: 0,
  };
  negotiationStage = {
    budget_value: 0,
    quotation_value: 0,
    budget_value_usd: 0,
    quotation_value_usd: 0,
  };
  awardStage = {
    budget_value: 0,
    quotation_value: 0,
    budget_value_usd: 0,
    quotation_value_usd: 0,
  };

  loadingGeneralView: boolean;

  getGeneralView() {
    this.loadingGeneralView = true;
    this.prospectingStage.budget_value = 0;
    this.prospectingStage.quotation_value = 0;
    this.prospectingStage.budget_value_usd = 0;
    this.prospectingStage.quotation_value_usd = 0;
    /*  */
    this.budgetStage.budget_value = 0;
    this.budgetStage.quotation_value = 0;
    this.budgetStage.budget_value_usd = 0;
    this.budgetStage.quotation_value_usd = 0;
    /*  */
    this.quotationStage.budget_value = 0;
    this.quotationStage.quotation_value = 0;
    this.quotationStage.budget_value_usd = 0;
    this.quotationStage.quotation_value_usd = 0;
    /*  */
    this.negotiationStage.budget_value = 0;
    this.negotiationStage.quotation_value = 0;
    this.negotiationStage.budget_value_usd = 0;
    this.negotiationStage.quotation_value_usd = 0;
    /*  */
    this.awardStage.budget_value = 0;
    this.awardStage.quotation_value = 0;
    this.awardStage.budget_value_usd = 0;
    this.awardStage.quotation_value_usd = 0;
    /*  */
    this._negocios.getGeneralView(this.formFiltersGeneralView.value).subscribe((res: any) => {
      this.generalView = res?.data;
      this.negocios_primera_etapa = res?.data?.filter(
        (t) => t?.status === 'Prospección'
      );
      this.negocios_segunda_etapa = res?.data?.filter(
        (t) => t?.status === 'Presupuesto'
      );
      this.negocios_tercera_etapa = res?.data?.filter(
        (t) => t?.status === 'Cotización'
      );
      this.negocios_cuarta_etapa = res?.data?.filter(
        (t) => t?.status === 'Negociación'
      );
      this.negocios_quinta_etapa = res?.data?.filter(
        (t) => t?.status === 'Adjudicación'
      );
      this.negocios_primera_etapa.forEach((element: any) => {
        this.prospectingStage.budget_value += element.budget_value;
        this.prospectingStage.quotation_value += element.quotation_value;
        this.prospectingStage.budget_value_usd += element.budget_value_usd;
        this.prospectingStage.quotation_value_usd += element.quotation_value_usd;
      });
      this.negocios_segunda_etapa.forEach((element: any) => {
        this.budgetStage.budget_value += element.budget_value;
        this.budgetStage.quotation_value += element.quotation_value;
        this.budgetStage.budget_value_usd += element.budget_value_usd;
        this.budgetStage.quotation_value_usd += element.quotation_value_usd;
      });
      this.negocios_tercera_etapa.forEach((element: any) => {
        this.quotationStage.budget_value += element.budget_value;
        this.quotationStage.quotation_value += element.quotation_value;
        this.quotationStage.budget_value_usd += element.budget_value_usd;
        this.quotationStage.quotation_value_usd += element.quotation_value_usd;
      });
      this.negocios_cuarta_etapa.forEach((element: any) => {
        this.negotiationStage.budget_value += element.budget_value;
        this.negotiationStage.quotation_value += element.quotation_value;
        this.negotiationStage.budget_value_usd += element.budget_value_usd;
        this.negotiationStage.quotation_value_usd += element.quotation_value_usd;
      });
      this.negocios_quinta_etapa.forEach((element: any) => {
        this.awardStage.budget_value += element.budget_value;
        this.awardStage.quotation_value += element.quotation_value;
        this.awardStage.budget_value_usd += element.budget_value_usd;
        this.awardStage.quotation_value_usd += element.quotation_value_usd;
      });
      this.loadingGeneralView = false;
    })
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
      neg?.business_budget?.forEach(el => {
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
