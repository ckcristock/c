import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotelesService } from '../hoteles/hoteles.service';
import { TaxisService } from './taxis.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.scss']
})
export class TaxisComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  cities:any[] = [];
  taxis:any[] = [];
  taxi:any = {};
  title:any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    tipo: ''
  }
  constructor( 
                private fb: FormBuilder,
                private _cities: HotelesService,
                private _taxi: TaxisService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getTaxis();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo taxi';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.taxi.id],
      route: [''],
      type: [''],
      city_id: [''],
      value: [''],
      taxi_id: [this.taxi.taxi_id]
    })
  }

  getCities(){
    this._cities.getCities().subscribe((r:any) => {
      this.cities = r.data;
    })
  }

  getTaxis( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._taxi.getTaxis(params).subscribe((r:any) => {
      this.taxis = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  getTaxi(taxi){
    this.taxi = {...taxi};
    this.title = 'Editar taxi';
    this.form.patchValue({
      id: this.taxi.id,
      route: this.taxi.route,
      city_id: this.taxi.city_id,
      type: this.taxi.type,
      value: this.taxi.value,
      taxi_id: this.taxi.taxi_id
    });
  }

  save(){
    let id = this.form.value.id;
    if (id) {
      this._taxi.updateTaxi(this.form.value, id).subscribe((r:any) => {
      this.modal.hide();
      this.getTaxis();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: 'Acualizado!',
        text: 'El Taxi ha sido actualizado satisfactoriamente',
        showCancel: false
      })
    })
  } else {
      this._taxi.createTaxi(this.form.value).subscribe((r:any) => {
        this.modal.hide();
        this.getTaxis();
        this.form.reset();
        this._swal.show({
          icon: 'success',
          title: '¡Creado!',
          text: 'El Taxi ha sido creado satisfactoriamente',
          showCancel: false
        })
      });
    }

  }

}
