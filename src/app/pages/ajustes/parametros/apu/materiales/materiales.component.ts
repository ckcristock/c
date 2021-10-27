import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { MaterialesService } from './materiales.service';
import { SwalService } from '../../../informacion-base/services/swal.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  title:any = '';
  materials:any[] = [];
  material:any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro = {
    name: ''
  }
  constructor( 
                private fb: FormBuilder,
                private _validators: ValidatorsService,
                private _materials: MaterialesService,
                private _swal: SwalService
              ) { } 

  ngOnInit(): void {
    this.createForm();
    this.getMaterials();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Material';
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', this._validators.required],
      unit: ['', this._validators.required],
      cut_water: [false],
      cut_laser: [false],
      type: ['', this._validators.required],
      unit_price: ['']
    })
  }

  getMaterial(material){
    this.material = {...material};
    this.title = 'Editar Material';
    this.form.patchValue({
      id: this.material.id,
      name: this.material.name,
      unit: this.material.unit,
      cut_water: this.material.cut_water,
      cut_laser: this.material.cut_laser,
      type: this.material.type,
      unit_price: this.material.unit_price
    })
  }

  getMaterials( page = 1 ){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._materials.getMaterials(params).subscribe((r:any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save(){
    if (this.material.id) {
      this._materials.update(this.form.value, this.material.id).subscribe((r:any) => {
        this.modal.hide();
        this.getMaterials();
        this.form.reset();
        this._swal.show({
          icon: 'success',
          title: 'Material actualizado con éxito',
          text: '',
          showCancel: false
        })
      })
    } else {
      this._materials.save(this.form.value).subscribe((r:any) =>{
        this.modal.hide();
        this.getMaterials();
        this.form.reset();
        this._swal.show({
          icon: 'success',
          title: 'Material creado con éxito',
          text: '',
          showCancel: false
        })
      })
    }
  }

}
