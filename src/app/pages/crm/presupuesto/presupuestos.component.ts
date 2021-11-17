import { Component, OnInit } from '@angular/core';

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

  presupuestos: any[] = []
  constructor() { }

  ngOnInit(): void {
  }

  getData(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    /*  this._apuParts.apuPartPaginate(params).subscribe((r:any) => {
       this.apuParts = r.data.data;
       this.pagination.collectionSize = r.data.total;
       this.loading = false;
     }) */
  }

}
