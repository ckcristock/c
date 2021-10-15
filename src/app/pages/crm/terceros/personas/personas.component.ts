import { Component, OnInit } from '@angular/core';
import { TercerosService } from '../terceros.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
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
