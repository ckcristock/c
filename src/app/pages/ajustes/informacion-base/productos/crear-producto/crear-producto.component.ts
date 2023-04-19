import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogoService } from '../../catalogo/catalogo.service';
import { SwalService } from '../../services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ProductoService } from '../producto.service';
import { DomSanitizer } from '@angular/platform-browser';
import { filter, skip, skipWhile } from 'rxjs/operators';
import { Router } from '@angular/router';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnInit {
  @Input('title') title = 'Agregar producto';
  @Input('data') data;
  @Input('id') id;
  form: FormGroup;
  packagings: any[] = [];
  masks = consts;
  unidades_medida: any[] = [];
  categories: any[] = [];
  taxes: any[] = [];
  subcategories: any[] = [];
  photoPreview: any;
  loading: boolean;
  constructor(
    private fb: FormBuilder,
    private _catalogo: CatalogoService,
    private _swal: SwalService,
    private _producto: ProductoService,
    private sanitizer: DomSanitizer,
    private router: Router,

  ) { }

  ngOnInit() {
    this.createForm();
    this.getData();
  }

  fillInForm() {
    this.form.patchValue({
      Id_Producto: this.data.Id_Producto,
      Id_Categoria: this.data.Id_Categoria,
      Id_Subcategoria: this.data.Id_Subcategoria,
      Nombre_Comercial: this.data.Nombre_Comercial,
      Presentacion: this.data.Presentacion,
      Referencia: this.data.Referencia,
      Unidad_Medida: this.data.Unidad_Medida,
      Precio: this.data.Precio,
      impuesto_id: this.data.impuesto_id,
      Codigo_Barras: this.data.Codigo_Barras,
      Embalaje_id: this.data.Embalaje_id,
      Imagen: this.data.Imagen,
    })
    this.photoPreview = this.data.Imagen;
    this.data.variables.forEach(element => {
      if (element.category_variables_id) {
        this.category_variables.push(this.addVariables(element, true, 'cat'));
      } else if (element.subcategory_variables_id) {
        this.subcategory_variables.push(this.addVariables(element, true, 'subcat'))
      }
    })

  }

  getData() {
    this.loading = true;
    this._producto.getDataCreate().toPromise().then((res: any) => {
      this.packagings = res.data.packagings;
      this.unidades_medida = res.data.units;
      this.categories = res.data.categories;
      this.taxes = res.data.taxes;
      this.loading = false;
      if (this.id && this.data) {
        this.fillInForm()
        let cat = this.categories.find(x => x.value == this.data.Id_Categoria)
        this.subcategories = cat.subcategories;
      }
    })
  }


  createForm() {
    this.form = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: ['', Validators.required],
      Id_Subcategoria: ['', Validators.required],
      Nombre_Comercial: ['', Validators.required],
      Presentacion: ['', Validators.required],
      Unidad_Medida: ['', Validators.required],
      Codigo_Barras: [''],
      Referencia: [''],
      impuesto_id: ['', Validators.required],
      Embalaje_id: ['', Validators.required],
      Precio: ['', Validators.required],
      Imagen: [''],
      typeFile: [''],
      category_variables: this.fb.array([]),
      subcategory_variables: this.fb.array([])
    });
    this.form.get('Id_Categoria').valueChanges.pipe(
      skip(this.id ? 1 : 0)
    ).subscribe(v => {
      let cat = this.categories.find(x => x.value == v)
      this.subcategories = cat.subcategories;
      this.getVariablesCat(v)
    })
    this.form.get('Id_Subcategoria').valueChanges.pipe(
      skip(this.id ? 1 : 0)
    ).subscribe(v => {
      this.getVariablesSubCat(v)
    })
  }

  laodingReload: boolean;

  async reload() {
    this.laodingReload = true;
    this.getVariablesCat(this.form.get('Id_Categoria').value);
    await this.getVariablesSubCat(this.form.get('Id_Subcategoria').value);
    this.laodingReload = false;
  }

  getVariablesCat(value) {
    this._producto.getVariablesCat(value).subscribe((res: any) => {
      this.category_variables.clear();
      res.data.forEach(element => {
        this.category_variables.push(this.addVariables(element))
      });
    })
  }

  async getVariablesSubCat(value) {
    await this._producto.getVariablesSubCat(value).toPromise().then((res: any) => {
      this.subcategory_variables.clear();
      res.data.forEach(element => {
        this.subcategory_variables.push(this.addVariables(element))
      });
    })
  }

  addVariables(element, edit = false, type = '') {
    return this.fb.group({
      id: [edit ? element.id : ''],
      subcategory_variables_id: [edit ? element.subcategory_variables_id : element.subcategory_id ? element.id : null],
      category_variables_id: [edit ? element.category_variables_id : element.category_id ? element.id : null],
      valor: [edit ? element.valor : '', Validators.required],
      label: [(edit && type == 'cat') ? element.category_variables.label : (edit && type == 'subcat') ? element.sub_category_variables.label : element.label],
      type: [(edit && type == 'cat') ? element.category_variables.type : (edit && type == 'subcat') ? element.sub_category_variables.type : element.type],
      required: [((edit && type == 'cat') ? element.category_variables.required : (edit && type == 'subcat') ? element.sub_category_variables.required : element.required) == 'Si' ? true : false]
    })
  }


  get subcategory_variables() {
    return this.form.get('subcategory_variables') as FormArray;
  }

  get category_variables() {
    return this.form.get('category_variables') as FormArray;
  }

  onFileSelected(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
      this.photoPreview = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.form.patchValue({
          Imagen: base64,
          typeFile: file.type
        });
      });
    }
  }

  saveProductos() {
    console.log(this.form.value)
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar un nuevo producto.',
        icon: 'question',
        showCancel: true
      }).then((result) => {
        if (result.isConfirmed) {
          this._producto.save(this.form.value).subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Operacion exitosa',
              text: 'El producto ha sido registrado con éxito.',
              timer: 1000,
              showCancel: false
            });
            this.router.navigateByUrl('/ajustes/informacion-base/catalogo')
          }, (error) => {
            this._swal.show({
              icon: 'error',
              title: 'Se presentó un error!',
              text: error.message,
              showCancel: false
            });
          });
        }
      })
    } else {
      this._swal.incompleteError();
    }
  }
}
