import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EspesoresService } from './espesores.service';

@Component({
  selector: 'app-espesores',
  templateUrl: './espesores.component.html',
  styleUrls: ['./espesores.component.scss']
})
export class EspesoresComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  loading:boolean = false;
  title:any = '';
  espesores:any[] = [];
  espesor:any = {};
  constructor(
                private fb: FormBuilder,
                private _espesores: EspesoresService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createform();
    this.getThicknesses();
  }

  createform(){
    this.form = this.fb.group({
      id: [this.espesor.id],
      thickness: ['', Validators.required]
    })
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Espesor';
  }

  getThickness(espesor){
    this.espesor = {...espesor};
    this.title = 'Actualizar Espesor';
    this.form.patchValue({
      id: this.espesor.id,
      thickness: this.espesor.thickness
    })
  }

  getThicknesses(){
    this.loading = true;
    this._espesores.getMeasures().subscribe((r:any) => {
      this.espesores = r.data;
      this.loading = false;
    })
  }

  save(){
    this._espesores.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getThicknesses();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
