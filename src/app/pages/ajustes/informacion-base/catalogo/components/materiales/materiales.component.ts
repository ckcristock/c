import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { MaterialesService } from './materiales.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { CategoryService } from '../../../services/category.service';

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
  Categorias: any[] = [];
  SubCategorias: any[] = [];
  Producto: any = {};
  DotationType: any[] = [];


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
                private _category: CategoryService,
                private fb: FormBuilder,
                private _validators: ValidatorsService,
                private _materials: MaterialesService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getMaterials();
    this.getThicknesses();
    this.getCategory();
    this.getDotationType();

  }

  getCategory() {
    this._category.getCategories().subscribe((r: any) => {
      this.Categorias = r.data;
      this.Categorias.unshift({ text: 'Seleccione ', value: '' });
    });
  }


  getSubCategories(Id_Categoria_Nueva) {
    this._category.getSubCategories(Id_Categoria_Nueva).subscribe((r: any) => {
      this.SubCategorias = r.data;
    });
  }
  getDinamicField(Id_Subcategoria) {
    this.Producto.Id_Producto
      ? this.getSubCategoryEdit(this.Producto.Id_Producto, Id_Subcategoria)
      : this.getDinamicVariables(Id_Subcategoria);
  }
  getSubCategoryEdit(Id_Producto, Id_Subcategoria) {
    this._category
      .getSubCategoryEdit(Id_Producto, Id_Subcategoria)
      .subscribe((r: any) => {
        this.fieldDinamic.clear();
        r.data.forEach((e) => {
          let group = this.fb.group({
            subcategory_variables_id: e.subcategory_variables_id,
            id: e.id,
            label: e.label,
            type: e.type,
            valor: e.valor,
          });
          this.fieldDinamic.push(group);
        });
      });
  }
  getDinamicVariables(Id_Subcategoria) {
    this._category.getDinamicVariables(Id_Subcategoria).subscribe((r: any) => {
      // this.fieldDinamic.clear();
      r.data.forEach((e) => {
        let group = this.fb.group({
          //  id:e.id,
          subcategory_variables_id: e.id,
          label: e.label,
          type: e.type,
          valor: e.valor,
        });
        this.fieldDinamic.push(group);
      });
    });
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as FormArray;
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Material';
  }

  closeModalVer(){
    this.modal.hide();
    this.fieldList.clear();
  }

  getDotationType() {
    this._category.getDotationType().subscribe((r: any) => {
      this.DotationType = r.data;
      this.DotationType.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.material.id],
      name: ['', this._validators.required],
      unit: ['', this._validators.required],
      type: ['', this._validators.required],

      Id_Categoria: [''],
      Id_Subcategoria: [''],
      //Producto_Dotation_Type_Id: [''],
      //Codigo: [''],
      Codigo_Barras: [''],
      Tipo_Catalogo: [''],
      //Status: [''],
      //Producto_Dotacion_Tipo: [''],


      unit_price: [''],
      kg_value: ['', this._validators.required],
      fields: this.fb.array([]),
      thicknesses: this.fb.array([]),
      dynamic: this.fb.array([]),

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
    this.material.material_thickness.forEach(r => {
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
    if (this.form.get('id').value) {
      this._materials.update(this.form.value, this.material.id).subscribe((r:any) => {
        this.form.reset();
        this.modal.hide();
        this.thicknessList.clear();
        this.fieldList.clear();
        this.getMaterials();
        this._swal.show({
          icon: 'success',
          title: 'Material actualizado con éxito',
          text: '',
          showCancel: false
        })
      })
    } else {
      this._materials.save(this.form.value).subscribe((r:any) =>{
        this.form.reset();
        this.modal.hide();
        this.thicknessList.clear();
        this.fieldList.clear();
        this.getMaterials();
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
