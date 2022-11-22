import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { Router } from '@angular/router';
import { PrimasService } from '../primas.service';

@Component({
  selector: 'app-prima-funcionario',
  templateUrl: './prima-funcionario.component.html',
  styleUrls: ['./prima-funcionario.component.scss']
})
export class PrimaFuncionarioComponent implements OnInit {
  loading: boolean;
  empleados: any;
  ulrTree: any;
  page: number;
  previousPage: number;
  paginacion = true;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  totalPag: any;

  constructor(
    private _primas: PrimasService,
    private router: Router,
    private paginator: MatPaginatorIntl,
  ) {
    this.ulrTree = this.router.parseUrl(this.router.url);
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit(): void {
    this.page = 1;
	  this.previousPage = 1;
    this.calcularPrimas();
  }

  calcularPrimas(){
    this.loading = true;
    let params = {
      fecha_inicio: new Date("07/01/2022"),
      fecha_fin: new Date("12/31/2022")
    }
    this._primas.setBonus(params)
    .subscribe((r:any)=>{
      this.empleados = r.data;
      this.totalPag = r.data.total_empleados;
      console.log(r.data.total_empleados);
      this.loading = false;
    });
  }

}
