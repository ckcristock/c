import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operators';
import { ModalNoCloseService } from 'src/app/core/services/modal-no-close.service';
import { ModalService } from 'src/app/core/services/modal.service';
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
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor(
    private router: Router,
    private _modal: ModalNoCloseService,
    private _budgets: BudgetService,
    private platformLocation: PlatformLocation,
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

  getBudgets(page = 1) {
    this.loading = true
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    this._budgets.getAllPaginate(params).subscribe((r: any) => {
      this.budgets = r.data.data
      this.pagination.collectionSize = r.data.total;
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
