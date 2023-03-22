import { Component, OnInit } from '@angular/core';
import { rightArithShift } from 'mathjs';
import { HistorialDatosService } from './historial-datos.service';

import { variables } from './variables'
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-historial-datos',
  templateUrl: './historial-datos.component.html',
  styleUrls: ['./historial-datos.component.scss']
})
export class HistorialDatosComponent implements OnInit {
  historialdatos: any[];
  loading: boolean;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  constructor(
    private _historialdatos: HistorialDatosService,
    private paginator: MatPaginatorIntl
  ) { }

  ngOnInit(): void {
    this.getHistoryDataCompany();
  }

  getHistoryDataCompany(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._historialdatos.getHistoryDataCompany(this.pagination).subscribe((res: any) => {
      this.loading = false;
      this.historialdatos = res.data.data;
      this.historialdatos.forEach(history => {
        let item = variables.find(x => x.campo == history.data_name)
        history.data_name_for_user = item?.nombre
      });
      this.pagination.collectionSize = res.data.total;

    });
  }

}


