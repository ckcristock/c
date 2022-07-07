import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { BudgetService } from './budget.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.scss']
})
export class PresupuestosComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
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
