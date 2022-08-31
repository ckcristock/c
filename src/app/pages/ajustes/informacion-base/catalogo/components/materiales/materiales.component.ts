import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { MaterialesService } from './materiales.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { CategoryService } from '../../../services/category.service';
import { UserService } from 'src/app/core/services/user.service';
import { throwIfEmpty } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
  @ViewChild('modalVer') modalVer: any;
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() cardBorder: any;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  form: FormGroup;
  title: any = '';
  materials: any[] = [];
  Categorias: any[] = [];
  SubCategorias: any[] = [];
  Producto: any = {};
  DotationType: any[] = [];
  paginacion: any

  thicknesses: any[] = [];
  material: any = {};
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
    private _user: UserService,
    private _validators: ValidatorsService,
    private _materials: MaterialesService,
    private _swal: SwalService,
    private modalService: NgbModal,
    private paginator: MatPaginatorIntl,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit(): void {
    console.log(this.cardBorder)
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

  closeResult = '';

  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.fieldList.clear();
    this.form.reset();
    this.thicknessList.clear();
    this.fieldList.clear();
    this.getThicknesses();

  }

  openModal() {
    this.modal.show();
  }

  closeModalVer() {
    this.modalService.dismissAll();
    this.fieldList.clear();
  }

  closeModal() {
    this.modalService.dismissAll();
    this.form.reset();
    this.thicknessList.clear();
    this.fieldList.clear();
    this.getThicknesses();
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
      name: ['', this._validators.required],
      unit: ['', this._validators.required],
      type: ['', this._validators.required],
      Id_Categoria: ['', this._validators.required],
      Id_Subcategoria: ['', this._validators.required],
      Codigo_Barras: ['', this._validators.required],
      Tipo_Catalogo: ['', this._validators.required],
      product_id: [''],
      unit_price: [''],
      kg_value: ['', this._validators.required],
      fields: this.fb.array([]),
      thicknesses: this.fb.array([]),
      dynamic: this.fb.array([]),

    });
  }


  getMaterial(material) {
    this.material = { ...material };
    this.form.patchValue({
      id: this.material.id,
      product_id: this.material.product_id,
      name: this.material.name,
      unit: this.material.unit,
      type: this.material.type,
      Codigo_Barras: this.material.product.Codigo_Barras,
      Tipo_Catalogo: this.material.product.Tipo_Catalogo,
      Id_Categoria: this.material.product.Id_Categoria,
      Id_Subcategoria: Number(this.material.product.Id_Subcategoria),
      unit_price: this.material.unit_price,
      kg_value: this.material.kg_value
    });


    this.getSubCategories(this.material.product.Id_Subcategoria);
    this.getSubCategoryEditar(this.material.product_id, this.material.product.Id_Subcategoria);
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

  getMaterials(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
      company_id: this._user.user.person.company_worked.id

    }

    this.loading = true;
    this._materials.getMaterials(params).subscribe((r: any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    if (this.form.get('id').value) {
      this._materials.update(this.form.value, this.material.id).subscribe((r: any) => {
        this.form.reset();
        this.modalService.dismissAll();
        this.thicknessList.clear();
        this.fieldList.clear();
        this.getMaterials();
        this._swal.show({
          icon: 'success',
          title: 'Material actualizado con éxito',
          text: '',
          showCancel: false,
          timer: 1000,
        })
      })
    } else {
      this._materials.save(this.form.value).subscribe((r: any) => {
        this.form.reset();
        this.modalService.dismissAll();
        this.thicknessList.clear();
        this.fieldList.clear();
        this.getMaterials();
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
