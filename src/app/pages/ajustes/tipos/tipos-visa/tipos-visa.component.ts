import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposVisaService } from './tipos-visa.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-tipos-visa',
  templateUrl: './tipos-visa.component.html',
  styleUrls: ['./tipos-visa.component.scss']
})
export class TiposVisaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  visas:any[] = [];
  visa:any = {};
  title:any = '';
  pagination = {
    page: 1,
    pageSize: 6,
    collectionSize: 0
  }
  constructor( 
                private fb: FormBuilder,
                private _visa: TiposVisaService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getVisaTypes();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo tipo de visa';
  }

  createForm(){
    this.form = this.fb.group({
      id:[this.visa.id],
      name: ['', Validators.required],
      purpose: ['']
    });
  }

  getVisaTypes( page = 1 ){
    this.pagination.page = page;
    this.loading = true;
    this._visa.getVisaTypes(this.pagination).subscribe((r:any) => {
      this.visas = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  getVisaType(visa){
    this.visa = {...visa};
    this.title = 'Editar Tipo de Visa';
    this.form.patchValue({
      id: this.visa.id,
      name: this.visa.name,
      purpose: this.visa.purpose
    })
  }

  save(){
    this._visa.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getVisaTypes();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

  activateOrInactivate(visa, state) {
    let data = {
      id: visa.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El tipo de visa será desactivado!' : 'El tipo de visa será Activado'),
      icon: 'question',
      showCancel: true
    })
    .then((result) =>{
      if (result.isConfirmed) {
        this._visa.save(data).subscribe( (r:any) =>{
          this.getVisaTypes();
        })
        this._swal.show({
          icon: 'success',
          title: '¡Activado!',
          text: (data.state == 'Activo' ? 'El tipo de visa ha sido Activado con éxito.' : 'El tipo de visa ha sido desactivado con éxito.'),
          timer: 2500,
          showCancel: false
        })
      }
    })
  }

}
