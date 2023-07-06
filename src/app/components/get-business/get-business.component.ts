import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { NegociosService } from 'src/app/pages/crm/negocios/negocios.service';

@Component({
  selector: 'app-get-business',
  templateUrl: './get-business.component.html',
  styleUrls: ['./get-business.component.scss']
})
export class GetBusinessComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output('update') update = new EventEmitter();
  formFilters: FormGroup;
  loading: boolean;
  business: any[] = [];
  businessSelected: any[] = [];
  types: any[] = [];
  paginationMaterial: any;
  datePipe = new DatePipe('es-CO');
  pagination: any = {
    page: '',
    pageSize: localStorage.getItem('paginationItemsBusiness') || 100,
  }

  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocios: NegociosService,
    private _paginator: PaginatorService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this.businessSelected = [];
    this._modal.open(this.modal, 'xl');
    this.createFormFilters();
    this.getTypes();
    this.getBusiness();
  }

  getTypes() {
    this._negocios.indexType().subscribe((res: any) => {
      this.types = res?.data;
    })
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      code: '',
      name: '',
      company_name: '',
      date_start: '',
      date_end: '',
      status: 'Adjudicación',
      business_type_id: '',
    });
    this.formFilters.valueChanges.pipe(debounceTime(500)).subscribe(r => {
      this.getBusiness()
    })
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage.setItem('paginationItemsBusiness', this.pagination?.pageSize)
    this.getBusiness()
  }

  addBusinessForParent() {
    console.log(this.businessSelected)
    this.update?.emit(this.businessSelected);
    this._modal?.close();
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.formFilters.patchValue({
        date_start: this.datePipe.transform(fecha?.value?.begin?._d, 'yyyy-MM-dd'),
        date_end: this.datePipe.transform(fecha?.value?.end?._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFilters.patchValue({
        date_start: '',
        date_end: ''
      });
    }
  }

  addBusiness(item, event) {
    const index = this.businessSelected?.findIndex(x => (x?.id === item?.id));
    if (item?.selected) {
      if (index === -1) {
        this.businessSelected?.push(item)
        item.selected = true
      }
    } else if (index !== -1) {
      this.businessSelected?.splice(index, 1);
      item.selected = false
    }
  }

  async getBusiness() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    await this._negocios.getBusinesses(params).toPromise().then((resp: any) => {
      this.business = resp?.data?.data;
      this.paginationMaterial = resp?.data;
      this.business?.forEach(business => {
        this.businessSelected?.forEach(businessSelected => {
          if (businessSelected?.id == business?.id) {
            business.selected = true
          }
        });
      });
      if (this.paginationMaterial?.last_page < this.pagination?.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getBusiness()
      }
      this.loading = false;
    });
  }

}
