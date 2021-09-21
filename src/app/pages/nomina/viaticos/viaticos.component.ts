import { Component, OnInit } from '@angular/core';
import {CrearViaticosService} from './crear-viaticos/crear-viaticos.service';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss']
})
export class ViaticosComponent implements OnInit {
  data:any []= [
    ]
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor( private _viaticos:CrearViaticosService) { }

  ngOnInit(): void {
    this.getAll(); 
  }
  
  getAll(){
    this._viaticos.getAllViaticos({}).subscribe( (r:any)=>{
      this.data = r.data;
    })
  }

}
