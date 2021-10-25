import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TipoActividadesService } from './tipo-actividades.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-tipos-actividades',
  templateUrl: './tipos-actividades.component.html',
  styleUrls: ['./tipos-actividades.component.scss']
})
export class TiposActividadesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  title:any = '';
  activityTypes:any[] = [];
  activity:any = {};
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor( 
                private fb: FormBuilder,
                private _tipoAct: TipoActividadesService,
                private _validators: ValidatorsService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getActivityTypes();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo tipo de actividades';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.activity.id],
      name: ['', this._validators.required],
      color: ['', this._validators.required]
    })
  }

  getActivity(activity){
    this.activity = {...activity};
    this.title = 'Editar Tipo de Actividad';
    this.form.patchValue({
      id: this.activity.id,
      name: this.activity.name,
      color: this.activity.color
    })
  }

  getActivityTypes(page = 1){
    this.pagination.page = page;
    this.loading = true;
    this._tipoAct.getActivityTypes(this.pagination).subscribe((r:any) => {
      this.activityTypes = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save(){
    this._tipoAct.saveActivityType(this.form.value).subscribe((r:any) => {
      this.getActivityTypes();
      this.modal.hide();
      this.form.reset();
    })
  }

}
