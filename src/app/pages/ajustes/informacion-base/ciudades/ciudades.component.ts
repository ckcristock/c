import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadesService } from './ciudades.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.scss']
})
export class CiudadesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  countries:any[] = [];
  cities:any[] = [];
  city:any = {};
  title:any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    name: '',
    country: ''
  }
  constructor(
                private fb: FormBuilder,
                private _ciudades: CiudadesService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getContries();
    this.getCities();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nueva Ciudad';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.city.id],
      name: ['', Validators.required],
      country_id: ['', Validators.required]
    });
  }

  getContries(){
    this._ciudades.getContries().subscribe((r:any) => {
      this.countries = r.data;
      this.countries.unshift({ text: 'Todos', value: 0 });
    })
  }

  getCity(city){
    this.city = {...city};
    this.title = 'Editar Ciudad';
    this.form.patchValue({
      id: this.city.id,
      name: this.city.name,
      country_id: this.city.country_id
    });
  }

  getCities(page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._ciudades.getCities(params).subscribe((r:any) => {
      this.cities = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save(){
    this._ciudades.createCity(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getCities();
      this._swal.show({
        icon: 'success',
        title: '¡Creado!',
        text: 'La ciudad ha sido creada satisfactoriamente',
        showCancel: false
      })
    })
  }

  activateOrInactivate(city, state) {
    let data = {
      id: city.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: "¡La Ciudad será Desactivada!",
      icon: 'question',
      showCancel: true
    })
    .then((result) =>{
      if (result.isConfirmed) {
        this._ciudades.createCity(data).subscribe( (r:any) =>{
          this.getCities();
        })
        this._swal.show({
          icon: 'success',
          title: '¡Activada!',
          text: 'La Ciudad ha sido Activada con éxito.',
          timer: 2500,
          showCancel: false
        })
      }
    })
  }

}
