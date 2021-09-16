import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  form:FormGroup;
  loading:boolean = false;
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  data = [
    {
      nit: '10012',
      name: 'Jorge Peraza',
      adress: 'Calle 12 #20-22',
      city: 'Bucaramanga',
      cell: '32051515',
      tercerType:  'Proveedor'
    }
  ]
  constructor( private _tercerosService: TercerosService, private fb: FormBuilder ) { }

  ngOnInit(): void {
  }

}
