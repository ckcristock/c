import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisesService } from './paises.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from 'ng2-charts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  paises:any[] = [];
  pais:any = {};
  filtro:any = {
    name: ''
  }
  pagination:any = {
    page : 1,
    pageSize: 5,
    collectionSize: 0
  }
  form = new FormGroup({
    name : new FormControl('', [Validators.required])
  })
  constructor( private _paisesService: PaisesService  ) { }

  ngOnInit(): void {
    this.getCountries();
  }

  openModal() {
  this.modal.show();
  this.pais.id = '';
  this.pais.name = '';
  }
  
  getData( data ) {
    this.pais = {...data};
  }

  getCountries( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._paisesService.getCountries(params)
    .subscribe( (res:any) => {
      this.paises = res.data.data;
    })
  }

  createCountry() {
    this._paisesService.createCountry(this.pais)
    .subscribe( (res:any) => {
       console.log(res);
       this.getCountries();
       this.modal.hide();
       Swal.fire({ 
        icon: 'success',
        title: res.data,  
        text: 'Se ha agregado a los paises con éxito.'
      })
    })
  }
 
  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched
  }

}
