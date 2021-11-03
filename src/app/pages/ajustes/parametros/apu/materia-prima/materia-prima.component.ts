import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { MateriaPrimaService } from './materia-prima.service';
import { SwalService } from '../../../informacion-base/services/swal.service';

@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html',
  styleUrls: ['./materia-prima.component.scss']
})
export class MateriaPrimaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form:FormGroup;
  title:any = '';
  type:any = '';
  rawMaterials:any[] = [];
  rawMaterial:any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor( 
                private fb: FormBuilder,
                private _validators: ValidatorsService,
                private _materiaPrima: MateriaPrimaService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getRawMaterials();
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', this._validators.required],
      fields: this.fb.array([])
    });
  }

  getRawMaterials(page = 1){
    this.pagination.page = page;
    this.loading = true;
    this._materiaPrima.getRawMaterials(this.pagination).subscribe((r:any) => {
      this.rawMaterials = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  getRawMaterial(rawmaterial){
    this.rawMaterial = {...rawmaterial};
    this.title = 'Actualizar materia prima';
    this.form.patchValue({
      name: this.rawMaterial.name
    })
    this.fieldList.clear();
    this.rawMaterial.raw_material_fild.forEach(r => {
      let group = this.fb.group({
        property: [r.property],
        type: [r.type],
        value: [r.value]
      });
      this.fieldList.push(group);
    });
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
  
  deleteField(){
    this.fieldList.removeAt(this.fieldList.length - 1);
  }

  openModal(){
    this.modal.show();
    this.title = 'Nueva materia prima';
  }

  closeModal(){
    this.modal.hide();
    this.fieldList.clear();
  }

  save(){
    if (this.rawMaterial.id) {
      this._materiaPrima.update(this.form.value, this.rawMaterial.id).subscribe((r:any) => {
      this.fieldList.clear();
      this.form.reset();
      this.modal.hide();
      this.getRawMaterials();
      this._swal.show({
        icon: 'success',
        title: 'actualizada con éxito',
        text: 'La materia prima ha sido actualizada con éxito'
      });
      })
    } else {
      this._materiaPrima.save(this.form.value).subscribe((r:any) => {
        this.fieldList.clear();
        this.form.reset();
        this.modal.hide();
        this.getRawMaterials();
        this._swal.show({
          icon: 'success',
          title: 'Creada con éxito',
          text: 'La materia prima ha sido creada con éxito'
        });
      });
    }
  }

}
