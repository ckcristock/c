import { Component, OnInit } from '@angular/core';
import { BudgetService } from './budget.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  loading = false
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {}

  budgets: any[] = []
  constructor(private _budget: BudgetService) { }

  ngOnInit(): void {
    this.getBudgets()
  }
  estadoFiltros = false;
  mostrarFiltros(){
    this.estadoFiltros = !this.estadoFiltros
  }

  getBudgets(page = 1): void {
    this.loading = true;

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this._budget.getAllPaginate(params).subscribe((r: any) => {
      this.budgets = r.data.data
      console.log( this.budgets);
      
      this.pagination.collectionSize = r.data.total;
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
