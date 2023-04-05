import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { MaterialesService } from './materiales.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { CategoryService } from '../../../informacion-base/services/category.service';
import { UserService } from 'src/app/core/services/user.service';
import { throwIfEmpty } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() cardBorder: any;
  masksMoney = consts
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  title: any = '';
  materials: any[] = [];
  materialsIndex: any[] = [];
  Categorias: any[] = [];
  allMaterialsIndex: any[] = [];
  SubCategorias: any[] = [];
  Producto: any = {};
  DotationType: any[] = [];
  paginacion: any
  thicknesses: any[] = [];
  material: any = {};
  pagination = {
    page: 1,
    pageSize: 50,
    collectionSize: 0
  }
  filtro = {
    name: ''
  }

  constructor(
    private _category: CategoryService,
    private fb: FormBuilder,
    private _user: UserService,
    private _validators: ValidatorsService,
    private _materials: MaterialesService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private paginator: MatPaginatorIntl,
    private _modal: ModalService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getMaterials();
    this.getMaterialsIndex();
    this.getThicknesses();
    this.getCategory();
    this.getDotationType();
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  async getMaterialsIndex() {
    await this._materials.getMaterialsIndex().toPromise().then((res: any) => {
      this.allMaterialsIndex = res.data;
      this.materialsIndex = res.data.filter(material => {
        const exists = this.materials.some(m => m.material_id === material.id);
        return !exists;
      });
    })
  }

  getCategory() {
    this._category.getCategories().subscribe((r: any) => {
      this.Categorias = r.data;
      this.Categorias.unshift({ Nombre: 'Seleccione ', Id_Categoria_Nueva: '' });
    });
  }


  getSubCategories(event) {
    this._category.indexSubCategories(event).subscribe((r: any) => {
      this.SubCategorias = r.data;
    });
  }

  getDinamicField(Id_Subcategoria) {
    this.Producto.Id_Producto
      ? this.getSubCategoryEditar(this.Producto.Id_Producto, Id_Subcategoria)
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

  handlePageEvent(event: PageEvent) {
    this.getMaterials(event.pageIndex + 1)
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as FormArray;
  }


  openConfirm(confirm, titulo, sz = 'lg') {
    /* this.fieldDinamic.clear(); */
    this.title = titulo;
    this._modal.open(confirm, sz)
    if (titulo != 'Editar material') {
      this.getMaterialsIndex();
      /* this.fieldList.clear(); */
      this.form.reset();
      this.thicknessList.clear();
      /* this.fieldList.clear(); */
      this.getThicknesses();
    }
  }

  getThicknesses() {
    this._materials.getThicknesses().subscribe((r: any) => {
      this.thicknesses = r.data;
      this.thicknessPush();
    })
  }

  thicknessPush() {
    let thicknesses = this.form.get('thicknesses') as FormArray;
    thicknesses.clear();
    this.thicknesses.forEach(element => {
      thicknesses.push(this.thicknessGroup(element, this.fb));
    });
  }


  getDotationType() {
    this._category.getDotationType().subscribe((r: any) => {
      this.DotationType = r.data;
      this.DotationType.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.material.id],
      material_id: ['', this._validators.required],
      thicknesses: this.fb.array([]),
      /* fields: this.fb.array([]), */
      /* dynamic: this.fb.array([]), */

    });
  }


  async getMaterial(material) {
    this.material = { ...material };
    console.log(material)
    await this.getMaterialsIndex();
    let temp = this.allMaterialsIndex.filter(mat => mat.id == material.material_id);
    this.materialsIndex.push(temp[0])
    this.form.patchValue({
      id: this.material.id,
      material_id: this.material.material_id,
      /* product_id: this.material.product_id,
      type: this.material.type,
      unit: this.material.unit,
      Codigo_Barras: this.material.product?.Codigo_Barras,
      Tipo_Catalogo: this.material.product?.Tipo_Catalogo,
      Id_Categoria: this.material.product?.Id_Categoria,
      Id_Subcategoria: Number(this.material.product?.Id_Subcategoria),
      unit_price: this.material.unit_price, */
    });
    /* this.getSubCategories(this.material.product?.Id_Subcategoria);
    this.getSubCategoryEditar(this.material.product_id, this.material.product?.Id_Subcategoria);
    this.fieldList.clear();
    this.material.material_field.forEach(r => {
      let group = this.fb.group({
        property: [r.property],
        type: [r.type],
        value: [r.value]
      });
      this.fieldList.push(group);
    }); */
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


  getSubCategoryEditar(Id_Producto, Id_Subcategoria) {
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


  get thicknessList() {
    return this.form.get('thicknesses') as FormArray;
  }



  thicknessGroup(element, fb: FormBuilder) {
    let group = fb.group({
      thickness: [element.thickness],
      thickness_id: [element.id],
      value: [0]
    });
    return group;
  }

  fieldsControl() {
    let field = this.fb.group({
      property: [''],
      type: [''],
      value: ['']
    });
    return field;
  }

  get fieldList() {
    return this.form.get('fields') as FormArray;
  }

  newField() {
    let field = this.fieldList;
    field.push(this.fieldsControl());
  }

  deleteField(i) {
    this.fieldList.removeAt(i);
  }

  async getMaterials(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
      company_id: this._user.user.person.company_worked.id

    }

    this.loading = true;
    await this._materials.getMaterials(params).toPromise().then((r: any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    if (this.form.get('id').value) {
      this._materials.update(this.form.value, this.material.id).subscribe(async (r: any) => {
        this.form.reset();
        this.modalService.dismissAll();
        this.thicknessList.clear();
        //this.fieldList.clear();
        await this.getMaterials();
        this.getMaterialsIndex();
        this._swal.show({
          icon: 'success',
          title: 'Material actualizado con éxito',
          text: '',
          showCancel: false,
          timer: 1000,
        })
      })
    } else {
      this._materials.save(this.form.value).subscribe(async (r: any) => {
        this.form.reset();
        this.modalService.dismissAll();
        this.thicknessList.clear();
        //this.fieldList.clear();
        await this.getMaterials();
        this.getMaterialsIndex();
        this._swal.show({
          icon: 'success',
          title: 'Material creado con éxito',
          text: '',
          showCancel: false,
          timer: 1000,
        })
      })
    }
  }

}
