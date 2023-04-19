import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudesCompraService } from './solicitudes-compra.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { MatAccordion, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DateAdapter } from 'saturn-datepicker';

@Component({
  selector: 'app-solicitudes-compra',
  templateUrl: './solicitudes-compra.component.html',
  styleUrls: ['./solicitudes-compra.component.scss']
})
export class SolicitudesCompraComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  solicitudesCompra: any[] = []; 
  loading = false;
  paginationMaterial: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
  }
  formFilters: FormGroup;
  active_filters: boolean = false
  orderObj: any
  datePipe =new DatePipe('es-CO');
  date: any;
  date2: any;

  constructor(
    private _solicitudesCompra: SolicitudesCompraService,
    private _paginator: PaginatorService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>
  ) { 
    this.dateAdapter.setLocale('es');
  }

  ngOnInit(): void {
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
    if (Object.keys(this.orderObj).length > 3) {
      this.active_filters = true
      const formValues = {};
      for (const param in params) {
        formValues[param] = params[param];
      }
      this.formFilters.patchValue(formValues['params']);
      let start_created_at = new Date(this.formFilters.controls.start_created_at.value)
      let end_created_at = new Date(this.formFilters.controls.end_created_at.value)
      start_created_at.setDate(start_created_at.getDate() + 1)
      end_created_at.setDate(end_created_at.getDate() + 1)
      this.date = { begin: start_created_at, end: end_created_at }
      let start_expected_date = new Date(this.formFilters.controls.start_expected_date.value)
      let end_expected_date = new Date(this.formFilters.controls.end_expected_date.value)
      start_expected_date.setDate(start_expected_date.getDate() + 1)
      end_expected_date.setDate(end_expected_date.getDate() + 1)
      this.date2 = { begin: start_expected_date, end: end_expected_date }
    }
    this.getPurchaseRequest();
  })
  }


  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getPurchaseRequest()
  }

  resetFiltros() {
    this.date = '';
    this.date2 = '';
    this._paginator.resetFiltros(this.formFilters)
    this.active_filters = false
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFilters)
  }

  createFormFilters() {
    this.formFilters =this.fb.group({
      status: '',
      code: '',
      // work_order_id: '',      
      start_created_at: '',
      end_created_at: '',
      start_expected_date: '',
      end_expected_date: ''
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getPurchaseRequest();
    })
  } 

  getPurchaseRequest(){
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/compras/solicitud', paramsurl.toString());
    this._solicitudesCompra.getPurchaseRequest(params).subscribe((res: any) =>{
      this.solicitudesCompra= res.data.data;
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getPurchaseRequest()
      }
    });
  }

  selectedDate(fecha, type_date) {
    if (type_date == 'created_at') {
      if (fecha.value) {
        this.formFilters.patchValue({
          start_created_at: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
          end_created_at: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
        })
      } else {
        this.formFilters.patchValue({
          start_created_at: '',
          end_created_at: ''
        })
      }
    } else if (type_date == 'expected_date') {
      if (fecha.value) {
        this.formFilters.patchValue({
          start_expected_date: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
          end_expected_date: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
        })
      } else {
        this.formFilters.patchValue({
          start_expected_date: '',
          end_expected_date: ''
        })
      }
    }

  }
}
