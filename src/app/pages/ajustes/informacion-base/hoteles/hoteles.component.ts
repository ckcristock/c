import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelesService } from './hoteles.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.scss']
})
export class HotelesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  cities:any[] = [];
  hotels:any[] = [];
  hotel:any = {};
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
                private fb:FormBuilder,
                private _hoteles: HotelesService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getHotels();
  }
  
  openModal(){
    this.modal.show();
    this.title = 'Nuevo hotel';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.hotel.id],
      type: ['', Validators.required],
      name: ['', Validators.required],
      city_id: ['', Validators.required],
      landline: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      simple_rate: ['', Validators.required],
      double_rate: ['', Validators.required],
      breakfast: ['', Validators.required],
      accommodation: ['', Validators.required]
    })
  }

  getCities(){
    this._hoteles.getCities().subscribe((r:any) => {
      this.cities = r.data;
    });
  }

  getHotels( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._hoteles.getHotels(params).subscribe((r:any) => {
      this.hotels = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getHotel(hotel){
    this.hotel = {...hotel};
    this.title = 'Editar Hotel';
    this.form.patchValue({
      id: this.hotel.id,
      type: this.hotel.type,
      name: this.hotel.name,
      city_id: this.hotel.city_id,
      landline: this.hotel.landline,
      address: this.hotel.address,
      phone: this.hotel.phone,
      simple_rate: this.hotel.simple_rate,
      double_rate: this.hotel.double_rate,
      breakfast: this.hotel.breakfast,
      accommodation: this.hotel.accommodation
    })
  }

  save(){
    this._hoteles.createHotel(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.getHotels();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: '¡Creado!',
        text: 'El hotel ha sido creado satisfactoriamente',
        showCancel: false
      })
    })
  }

}
