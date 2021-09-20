import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss']
})
export class ViaticosComponent implements OnInit {
  data:any = [
    {
      funcionario: 'Néstor Lima',
      fecha: '20/05/2021',
      total: '100'
    }
  ]
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor() { }

  ngOnInit(): void {
    
  }
  
  

}
