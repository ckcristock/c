import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TercerosService } from '../terceros.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  people:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    third: ''
  }
  constructor( private _terceros: TercerosService ) { }

  ngOnInit(): void {
    this.getPerson();
  }
  estadoFiltros = false;
  mostrarFiltros(){
    this.estadoFiltros = !this.estadoFiltros
  }
  getPerson(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._terceros.getThirdPartyPerson(params).subscribe((r:any) => {
      this.people = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

}
