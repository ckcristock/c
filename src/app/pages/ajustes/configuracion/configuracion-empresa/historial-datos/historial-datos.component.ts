import { Component, OnInit } from '@angular/core';
import { rightArithShift } from 'mathjs';
import { HistorialDatosService } from './historial-datos.service';

import {variables} from './variables'

@Component({
  selector: 'app-historial-datos',
  templateUrl: './historial-datos.component.html',
  styleUrls: ['./historial-datos.component.scss']
})
export class HistorialDatosComponent implements OnInit {
  historialdatos: any[];
  loading: boolean;
  constructor(
    private _historialdatos: HistorialDatosService
  ) { }

  ngOnInit(): void {
    this.getHistoryDataCompany();
  }

  getHistoryDataCompany(){
    this.loading = true;
    this._historialdatos.getHistoryDataCompany().subscribe((res:any)=>{
      this.loading = false;
      this.historialdatos = res.data;
      this.historialdatos.forEach(history => {
        console.log(history);
        let item = variables.find(x=> x.campo == history.data_name)
        console.log(item);
        history.data_name_for_user = item.nombre
      });

    });
  }

}


