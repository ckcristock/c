import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
  thicknesses:any[] = [];
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
    this.getThicknesses();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Material';
  }

  closeModalVer(){
    this.modal.hide();
    this.fieldList.clear();
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', this._validators.required],
      unit: ['', this._validators.required],
      type: ['', this._validators.required],
      unit_price: [''],
      kg_value: ['', this._validators.required],
      fields: this.fb.array([]),
      thicknesses: this.fb.array([]),
    });
  }

  getThicknesses(){
    this._materials.getThicknesses().subscribe((r:any) => {
      this.thicknesses = r.data;
      this.thicknessPush();
    })
  }

  getMaterial(material){
    this.material = {...material};
    this.title = 'Editar Material';
    this.form.patchValue({
      id: this.material.id,
      name: this.material.name,
      unit: this.material.unit,
      type: this.material.type,
      unit_price: this.material.unit_price,
      kg_value: this.material.kg_value
    });
    this.fieldList.clear();
    this.material.material_field.forEach(r => {
      let group = this.fb.group({
        property: [r.property],
        type: [r.type],
        value: [r.value]
      });
      this.fieldList.push(group);
    });
    this.thicknessList.clear();
    this.material.thicknesses.forEach(r => {
      let group = this.fb.group({
        thickness: [r.thickness.thickness],
        thickness_id: [r.thickness_id],
        value: [r.value]
      });
      this.thicknessList.push(group);
    });
  }

  get thicknessList(){
    return this.form.get('thicknesses') as FormArray;
  }

  thicknessPush(){
    let thicknesses = this.form.get('thicknesses') as FormArray;
    thicknesses.clear();
    this.thicknesses.forEach(element => {
      thicknesses.push(this.thicknessGroup(element, this.fb));
    });
  }

  thicknessGroup(element, fb: FormBuilder){
    let group = fb.group({
      thickness: [element.thickness],
      thickness_id: [element.id],
      value: [0]
    });
    return group;
  }

  fieldsControl(){
    let field = this.fb.group({
      property: [''],
      type: [''],
      value: ['']
    });
    return field;
  }

  get fieldList(){
    return this.form.get('fields') as FormArray;
  }

  newField(){
    let field = this.fieldList;
    field.push(this.fieldsControl());
  }
  
  deleteField(i){
    this.fieldList.removeAt(i);
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
    console.log(this.form.value);
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
