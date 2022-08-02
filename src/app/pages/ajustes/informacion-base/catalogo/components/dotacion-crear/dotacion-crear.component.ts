import { IvyParser } from '@angular/compiler';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { CatalogoService } from '../../catalogo.service';
import { CategoryService } from '../../../services/category.service';
import { User } from 'src/app/core/models/users.model';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dotacion-crear',
  templateUrl: './dotacion-crear.component.html',
  styleUrls: ['./dotacion-crear.component.scss'],
})
export class DotacionCrearComponent implements OnInit {

  @Input('type') type;
  @Input('user') user: User;
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
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

  form: FormGroup;

  constructor(
    private _category: CategoryService,
    private _catalogo: CatalogoService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }
  loading = false;

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  };

  filtro: any = {
    name: '',
  };

  flagDinamicVariable: boolean;

  Productos: any[] = [];
  Categorias: any[] = [];
  DotationType: any[] = [];
  SubCategorias: any[] = [];
  Producto: any = {};

  ngOnInit(): void {
    this.getDotationType();
    this.getCategory();
    this.createForm();
    this.getData();
  }
  title:any;
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.fieldDinamic.clear();
    this.fieldDinamic.reset();
    this.Producto = {};
    this.getData();
    this.form.reset()
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  createForm() {
    this.form = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: [''],
      Id_Subcategoria: [''],
      Producto_Dotation_Type_Id: [''],
      Orden_Compra: [1],
      Ubicar: ['0'],
      Nombre_Comercial: [''],
      Embalaje: [''],
      Status: [''],
      id_inventary_dotations: [''],
      Descripcion_ATC: [''],
      Codigo_Barras: [''],
      Codigo: [''],
      Tipo_Catalogo: ['Dotacion_EPP'],
      Tipo: [''],
      dynamic: this.fb.array([]),
    });
  }

  editDotationProduct(producto) {
    console.log("producto");
    console.log(producto);
    this.Producto = { ...producto };
    // this.title = 'Editar Producto';
    this.form.patchValue({
      Id_Producto: producto.Id_Producto,
      Nombre_Comercial: producto.Nombre_Comercial,
      Tipo: producto.Tipo,
      Embalaje: producto.Embalaje,
      Descripcion_ATC: producto.Descripcion_ATC,
      Orden_Compra: 1,
      Ubicar: '0',
      Codigo_Barras: producto.Codigo_Barras,
      Codigo: producto.code_inventary_dotations,
      Status: producto.status,
      Tipo_Catalogo: 'Dotacion_EPP',
      Id_Categoria: Number(producto.Id_Categoria),
      Producto_Dotation_Type_Id: Number(producto.Producto_Dotation_Type_Id),
      Id_Subcategoria: Number(producto.Id_Subcategoria),
      id_inventary_dotations: producto.id_inventary_dotations,
      Principio_Activo: producto.Principio_Activo,
    });
    this.getSubCategories(producto.Id_Subcategoria);
    this.getSubCategoryEdit(producto.Id_Producto, producto.Id_Subcategoria);
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

  getDinamicField(Id_Subcategoria) {
    this.Producto.Id_Producto
      ? this.getSubCategoryEdit(this.Producto.Id_Producto, Id_Subcategoria)
      : this.getDinamicVariables(Id_Subcategoria);
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

  getSubCategories(Id_Categoria_Nueva) {
    this._category.getSubCategories(Id_Categoria_Nueva).subscribe((r: any) => {
      this.SubCategorias = r.data;
    });
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as FormArray;
  }

  saveProduct() {
    if (this.form.get('Id_Producto').value) {
      this._category
        .updateProduct(this.form.value, this.Producto.Id_Producto)
        .subscribe((r: any) => {
          // this.dataClear();
          Swal.fire({
            icon: 'success',
            title: 'Producto editado con éxito',
            text: '',
          });
          this.closeModal();
        });
    } else {
      this._category.save(this.form.value).subscribe((r: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado con éxito',
          text: '',
        });
        this.modalService.dismissAll();
        this.getData();
      });
    }
  }

  getData(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
      tipo: 'Dotacion_EPP',
      // company_id: this.user.person.company_worked.id,

    };
    this._catalogo.getData(params).subscribe((data: any) => {
      this.loading = false;
      this.Productos = data.data.data;
    });
  }

  getCategory() {
    this._category.getCategories().subscribe((r: any) => {
      this.Categorias = r.data;
      this.Categorias.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  getDotationType() {
    this._category.getDotationType().subscribe((r: any) => {
      this.DotationType = r.data;
      this.DotationType.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  closeModal() {
    this.fieldDinamic.clear();
    this.fieldDinamic.reset();
    this.Producto = {};
    this.form.reset();
    this.modalService.dismissAll();
    this.getData();
  }
}
