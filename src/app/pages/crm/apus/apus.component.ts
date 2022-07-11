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
  filtros:any = {
    date: '',
    code: '',
    name: '',
    city: '',
    client: '',
    line: '',
    type: '',
    description: ''
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
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
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
  matPanel2 = false;
  openClose2(){
    if (this.matPanel2 == false){
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }    
  }
  getApus(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._apus.getApus(params).subscribe((r:any) => {
      this.apus = r.data.data;
      console.log(this.apus)
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
