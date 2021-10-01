import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  form:FormGroup;
  parametro:string = '';
  loading:boolean = false;
  thirdParties:any[] = [];
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros:any = {
    nit: '',
    name: ''
  }
  constructor( 
                private _tercerosService: TercerosService, private fb: FormBuilder,
                public router: Router
              ) { }

  ngOnInit(): void {
    this.getThirdParties();
    this.parametro = this.router.url == '/ajustes/informacion-base/terceros' ? 'contabilidad' : 'crm';
  }

  getThirdParties(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._tercerosService.getThirdParties(params).subscribe((r:any) => {
      this.thirdParties = r.data.data;
      this.pagination.collectionSize = r.total;
      this.loading = false;
    });
  }

}
