import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { BudgetService } from 'src/app/pages/crm/presupuesto/budget.service';

@Component({
  selector: 'app-get-budgets',
  templateUrl: './get-budgets.component.html',
  styleUrls: ['./get-budgets.component.scss']
})
export class GetBudgetsComponent implements OnInit {
  @Output('sendBudgets') sendBudgets = new EventEmitter()
  @ViewChild('modal') modal: any;
  budgets: any[] = [];
  loading: boolean;
  constructor(
    private _modal: ModalService,
    private _budgets: BudgetService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this._modal.open(this.modal, 'xl');
    this.getBudgets();
  }

  getBudgets() {
    this.loading = true;
    this._budgets.getAll().subscribe((res: any) => {
      this.budgets = res.data;
      this.loading = false;
    })

  }

}
