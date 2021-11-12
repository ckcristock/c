import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { camposTerceros } from './campos-terceros';
import { CamposTercerosService } from './campos-terceros.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-campos-terceros',
  templateUrl: './campos-terceros.component.html',
  styleUrls: ['./campos-terceros.component.scss']
})
export class CamposTercerosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  tipos = camposTerceros.tipos;
  fields:any [] = [];
  constructor( 
                private fb: FormBuilder,
                private _field: CamposTercerosService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getFields();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      required: ['', Validators.required],
      length: ['']
    })
  }

  getFields(){
    this.loading = true;
    this._field.getFields().subscribe((r:any) => {
      this.loading = false;
      this.fields = r.data;
    })
  }

  save(){
    this._field.save(this.form.value).subscribe((r:any) => {
      console.log(r);
      this.modal.hide();
      this.form.reset();
      this.getFields();
    })
  }

  changeState(id, state){
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (state == 'Inactivo' ? '¡El campo se Anulará!': '¡El campo se Activará!')
    }).then((r) =>{
      if (r.isConfirmed) {
        this._field.changeState({state: state}, id).subscribe((r:any) => {
          this.getFields();
          this._swal.show({
              icon: 'success',
              title: 'Proceso Satisfactio',
              text: (state == 'Inactivo' ? 'El campo ha sido Anulado.' : 'El campo ha sido Activado.'),
              showCancel: false
          }); 
        })
      }
    });
  }

}
