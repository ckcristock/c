import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { ModalNoCloseService } from 'src/app/core/services/modal-no-close.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { BudgetService } from 'src/app/pages/crm/presupuesto/budget.service';

@Component({
  selector: 'app-get-budgets',
  templateUrl: './get-budgets.component.html',
  styleUrls: ['./get-budgets.component.scss']
})
export class GetBudgetsComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Output('sendBudget') sendBudget = new EventEmitter()
  public href: string = "";
  loading = false;
  budgets: any[] = [];
  people: any[] = [];
  dateMat = '';
  form_filters: FormGroup;
  modalRef: NgbModalRef;
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: localStorage?.getItem('paginationItemsBudget') || 100,
  }

  constructor(
    private router: Router,
    private _modal: ModalNoCloseService,
    private _budgets: BudgetService,
    private platformLocation: PlatformLocation,
    private _paginator: PaginatorService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private _person: PersonService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.href = (this.platformLocation as any).location.origin;
  }

  openModal() {
    this.modalRef = this.modalService.open(this.modal,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
        scrollable: true,
        backdrop: 'static',
        keyboard: false,
      });
    this.createFormFilters();
    this.getBudgets();
    this.getPeople();
  }

  handlePageEvent(event: PageEvent) {
    this._paginator?.handlePageEvent(event, this.pagination);
    localStorage?.setItem('paginationItemsBudget', this.pagination.pageSize)
    this.getBudgets()
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

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  getBudgets() {
    this.loading = true
    let params = {
      ...this.pagination,
      ...this.form_filters.value
    }
    this._budgets.getAllPaginate(params).subscribe((r: any) => {
      this.budgets = r.data.data
      this.paginationMaterial = r?.data
      if (this.paginationMaterial?.last_page < this.pagination?.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getBudgets()
      }
      this.loading = false;
    })
  }

  dateChange(e) {
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
  selectedOption;
  openNewTab(id) {
    let uri = '/crm/presupuesto/ver';
    const url = this.href + `${uri}/${id}`;

    window.open(url, '_blank');
  }

  send() {
    this.sendBudget.emit(this.selectedOption)
    this.modalRef.dismiss();
    //this._modal.close();
  }

}
