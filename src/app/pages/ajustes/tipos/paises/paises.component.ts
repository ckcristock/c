import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisesService } from './paises.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  paises:any[] = [];
  pais:any = {};
  selected:any;
  filtro:any = {
    name: ''
  }
  pagination:any = {
    page : 1,
    pageSize: 5,
    collectionSize: 0
  }
  form:FormGroup;
  constructor( private _paisesService: PaisesService, private fb:FormBuilder  ) { }

  ngOnInit(): void {
    this.getCountries();
    this.createForm();
  }

  openModal() {
  this.modal.show();
  this.form.reset();
  this.selected = 'Nuevo País';
  }
  
  getData( data ) {
    this.pais = {...data};
    this.selected = 'Actualizar País';
    this.form.patchValue({
      id: this.pais.id,
      name: this.pais.name
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pais.id],
      name: ['', this.pais.name]
    });
  }

  getCountries( page = 1 ) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._paisesService.getCountries(params)
    .subscribe( (res:any) => {
      this.paises = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  createCountry() {
    this._paisesService.createCountry(this.form.value)
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
