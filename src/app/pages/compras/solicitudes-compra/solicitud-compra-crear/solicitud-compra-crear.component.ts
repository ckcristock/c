import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';

@Component({
  selector: 'app-solicitud-compra-crear',
  templateUrl: './solicitud-compra-crear.component.html',
  styleUrls: ['./solicitud-compra-crear.component.scss']
})
export class SolicitudCompraCrearComponent implements OnInit {
  @Input('dataEdit') dataEdit;
  @Input('id') id;
  @Input('title') title = 'Nueva solicitud de compra';

  form: FormGroup;
  loading: boolean;
  categories: any[] = [];
  searching: boolean;
  searchFailed: boolean;
  masks = consts;
  path: string;
  today = new Date()
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  constructor(
    private fb: FormBuilder,
    private _solicitudesCompra: SolicitudesCompraService,
    private _swal: SwalService,
    private router: Router,
    private _consecutivos: ConsecutivosService
  ) { }

  async ngOnInit(): Promise<void> {

    this.datosCabecera.Fecha = !this.dataEdit && !this.id ? new Date() : this.dataEdit?.created_at;
    this.datosCabecera.Titulo = this.title;
    this.loading = true
    this.getCategoryForSelect();
    this.createForm();
    await this.getConsecutivo();
    this.loading = false
  }

  async getConsecutivo() {
    await this._consecutivos.getConsecutivo('purchase_requests').toPromise().then((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      if (!this.dataEdit && !this.id) {
        this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.datosCabecera.Codigo = con
      } else {
        this.datosCabecera.Codigo = this.dataEdit.code
      }
    })
  }

  getCategoryForSelect() {
    this._solicitudesCompra.getCategoryForSelect().subscribe((res: any) => {
      this.categories = res.data;
    })
  }

  validateProducts() {
    if (this.products.controls.length > 0) {
      this._swal.show({
        icon: 'warning',
        title: 'Productos en lista',
        text: 'Ya has agregado productos a la lista, si cambias este valor se vaciará la lista de productos.'
      }).then(r => {
        if (r.isConfirmed) {
          this.products.value.forEach(product => {
            this.productDelete.push(product.id)
          });

          this.products.clear();
        }
      })
    }
  }

  createForm() {
    this.form = this.fb.group({
      id: (this.dataEdit && this.id ? this.dataEdit.id : ''),
      category_id: [(this.dataEdit ? this.dataEdit.category_id : null), Validators.required],
      expected_date: [(this.dataEdit ? this.dataEdit.expected_date : null), Validators.required],
      observations: (this.dataEdit ? this.dataEdit.observations : null),
      code: [this.dataEdit ? this.dataEdit.code : this.datosCabecera.Codigo],
      format_code: [this.dataEdit ? this.dataEdit.format_code : this.datosCabecera.CodigoFormato],
      products: this.fb.array([], Validators.required),
    })
    this.form.get('category_id').valueChanges.subscribe(v => {
      this.validateProducts();
    })
    if (this.dataEdit) {
      this.dataEdit.product_purchase_request.forEach(product => {
        this.addProduct(product, true)
      });
    }
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this._solicitudesCompra.getProducts({ search: term, category_id: this.form.get('category_id').value }).pipe(
          tap((results) => {
            if (results.length === 0) {
              this.searchFailed = true;
            } else {
              this.searchFailed = false;
            }
          }),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  formatter = (x: any) => x.name;

  addProduct(prod, edit, $event = undefined, input = undefined) {
    if (!this.products.value.some(x => x.product_id == (edit ? prod.product_id : prod.Id_Producto))) {
      let product = this.fb.group({
        id: [edit ? prod.id : ''],
        product_id: [edit ? prod.product_id : prod.Id_Producto],
        reference: [edit ? prod.product.Referencia : prod.Referencia],
        name: [edit ? prod.name : prod.Nombre_Comercial],
        ammount: [edit ? prod.ammount : '1', Validators.min(1)],
        unit: [edit ? prod.product.unit.name : prod.unit.name],
      })
      this.products.push(product)
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Elemento duplicado',
        text: 'Ya has agregado este producto',
        showCancel: false
      })
    }
    if (!edit) {
      $event.preventDefault();
      input.value = '';
    }
  }

  get products() {
    return this.form.get('products') as FormArray;
  }
  productDelete: any[] = [];
  deleteProduct(index: number) {
    if (this.dataEdit && this.id) {
      this.productDelete.push(this.products.value[index].id);
    }
    this.products.removeAt(index);
  }

  savePurchaseRequest() {
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Si ya verificaste la información y estás de acuerdo, por favor procede.',
        icon: 'question',
        showCancel: true
      }).then(result => {
        if (result.isConfirmed) {
          const data = {
            ...this.form.value,
            products_delete: this.productDelete
          };
          this._solicitudesCompra.savePurchaseRequest(data).subscribe(r => {
            this._swal.show({
              title: '!Tarea completada con éxito!',
              text: 'Solicitud de compra ' + (this.form.value.id ? 'actualizada' : 'creada') + 'con éxito.',
              icon: 'success',
              showCancel: false,
              timer: 1000
            })

            this.router.navigateByUrl('/compras/solicitud')
          })
        } else {
          this._swal.show({
            icon: 'error',
            title: '¡Solicitud cancelada!',
            text: 'La solicitud no ha sido registrada correctamente',
            showCancel: false
          })
        }
      });
    } else {
      this._swal.incompleteError();
    }

  }

  get category_id_valid() {
    return (
      this.form.get('category_id').invalid && this.form.get('category_id').touched
    );
  }

  get expected_date_valid() {
    return (
      this.form.get('expected_date').invalid && this.form.get('expected_date').touched
    );
  }

}
