import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenciaConduccionService } from './licencia-conduccion.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-licencia-conduccion',
  templateUrl: './licencia-conduccion.component.html',
  styleUrls: ['./licencia-conduccion.component.scss']
})
export class LicenciaConduccionComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  licenses:any[] = [];
  license:any = {};
  title:any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor( 
                private fb: FormBuilder,
                private _licencia: LicenciaConduccionService,
                private _swal: SwalService
             ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDrivingLicenses();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nueva Licencia de conducción';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.license.id],
      type: ['', Validators.required],
      description: ['']
    })
  }

  getDrivingLicense(license){
    this.license = {...license};
    this.title = 'Editar Licencia de conducción';
    this.form.patchValue({
      id :this.license.id,
      type: this.license.type,
      description: this.license.description
    })
  }

  getDrivingLicenses( page = 1 ){
    this.pagination.page = page;
    this.loading = true;
    this._licencia.getDrivingLicenses(this.pagination).subscribe((r:any) => {
      this.licenses = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  activateOrInactivate(license, state) {
    let data = {
      id: license.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡La licencia será desactivada!' : 'La licencia será Activada'),
      icon: 'question',
      showCancel: true
    })
    .then((result) =>{
      if (result.isConfirmed) {
        this._licencia.save(data).subscribe( (r:any) =>{
          this.getDrivingLicenses();
        })
        this._swal.show({
          icon: 'success',
          title: '¡Activado!',
          text: (data.state == 'Activo' ? 'La licencia ha sido Activada con éxito.' : 'La licencia ha sido desactivada con éxito.'),
          timer: 2500,
          showCancel: false
        })
      }
    })
  }

  save(){
    this._licencia.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.getDrivingLicenses();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
