import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TercerosService } from '../terceros.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  checkPersona: boolean = true
  checkTercero: boolean = true
  checkTelefono: boolean = true
  checkEmail: boolean = true
  checkCargo: boolean = true
  checkObservacion: boolean = true
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
  people:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    third: '',
    phone: '',
    email: '',
    cargo: '',
    observacion: '',
    documento: ''
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
      console.log(this.people)
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

}
