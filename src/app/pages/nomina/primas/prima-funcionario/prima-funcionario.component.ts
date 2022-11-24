import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PrimasService } from '../primas.service';

@Component({
  selector: 'app-prima-funcionario',
  templateUrl: './prima-funcionario.component.html',
  styleUrls: ['./prima-funcionario.component.scss']
})
export class PrimaFuncionarioComponent implements OnInit {
  loading: boolean;
  empleados: any;
  page: number;
  previousPage: number;
  paginacion = true;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  totalPag: any;
  periodoObs: Observable<number>;
  anioObs: Observable<number>;
  parametros: Observable<string>
  anio: any;
  periodo: any;

  constructor(
    private _primas: PrimasService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";

    this.anioObs = route.params.pipe(map(p=> p.anio));
    this.periodoObs = route.params.pipe(map(p=> p.periodo));
  }

  ngOnInit(): void {
    this.page = 1;
	  this.previousPage = 1;
    this.calcularPrimas();
  }

  calcularPrimas(){
    this.loading = true;
    this.anioObs.subscribe(params=>this.anio = params);
    this.periodoObs.subscribe(params=>this.periodo = params);

    let params: any;
    if (this.periodo == 1) {
      params = {
        fecha_inicio: new Date(`01/01/${this.anio}`),
        fecha_fin: new Date(`06/30/${this.anio}`)
      }
    } else {
      params = {
        fecha_inicio: new Date(`07/01/${this.anio}`),
        fecha_fin: new Date(`12/30/${this.anio}`)
      }
    }

    this._primas.setBonus(params)
    .subscribe((r:any)=>{
      this.empleados = r.data;
      this.pagination.collectionSize = r.data.total_empleados;
      this.totalPag = r.data.total_empleados;
      this.loading = false;
    });
  }

}
