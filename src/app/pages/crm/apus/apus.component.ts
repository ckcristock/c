import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ApusService } from './apus.service';

@Component({
  selector: 'app-apus',
  templateUrl: './apus.component.html',
  styleUrls: ['./apus.component.scss']
})
export class ApusComponent implements OnInit {
  checkTipo: boolean = true 
  checkNombre: boolean = true 
  checkCliente: boolean = true 
  checkDestino: boolean = true 
  checkLinea: boolean = true 
  checkQuien: boolean = true 
  checkFecha: boolean = true 
  apus:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor( private _apus: ApusService ) { }

  ngOnInit(): void {
    this.getApus();
  }
  estadoFiltros = false;
  mostrarFiltros(){
    this.estadoFiltros = !this.estadoFiltros
  }
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
  getApus(page = 1){
    this.pagination.page = page;
    this.loading = true;
    this._apus.getApus(this.pagination).subscribe((r:any) => {
      this.apus = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
