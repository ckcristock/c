import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Router } from '@angular/router';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';

@Component({
  selector: 'app-solicitud-compra-crear',
  templateUrl: './solicitud-compra-crear.component.html',
  styleUrls: ['./solicitud-compra-crear.component.scss']
})
export class SolicitudCompraCrearComponent implements OnInit {
  @Input('data') data;
  @Input('id') id;
  form: FormGroup;
  loading: boolean;
  categories: any[] = [];
  searching: boolean;
  searchFailed: boolean;
  masks = consts;
  path: string;
  datosCabecera = {
    Titulo: 'Nueva solicitud de compra',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: ''
  }
  constructor(
    private fb: FormBuilder,
    private _solicitudesCompra: SolicitudesCompraService,
    private _swal: SwalService,
    private _modal: ModalService,
    private router: Router,
    private _consecutivos: ConsecutivosService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCategoryForSelect()
    if (this.data && this.id) {
      this.fillInForm();
    }
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('purchase_requests').subscribe((r:any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({format_code: this.datosCabecera.CodigoFormato})
      if (this.path != 'editar') {
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.datosCabecera.Codigo = con
      }
    })
  }

  fillInForm() {
    this.form.patchValue({
      id: this.data.id,
      category_id: this.data.category_id
    })
  }

  getCategoryForSelect() {
    this.loading = true
    this._solicitudesCompra.getCategoryForSelect().subscribe((res: any) => {
      this.categories = res.data;
      this.loading = false
    })
  }

  // view(){
  //   console.log(this.form)
  // }

  createForm() {
    this.form = this.fb.group({
      id: [],
      category_id: ['', Validators.required],
      expected_date: ['', Validators.required],
      observations: ['', Validators.required],
      products: this.fb.array([])
    })

  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
) =>
    text$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.searching = true)),
        switchMap((term) =>
            this._solicitudesCompra.getProducts({ search: term, category_id: this.form.get('category_id').value  }).pipe(
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

addProduct(prod, $event, input) {
  let product = this.fb.group({
    id: [prod.Id_Producto],
    reference: [prod.Referencia],
    name: [prod.name],
    ammount: [1, Validators.min(1)],
    unit: [prod.unit.name],
  })

  this.products.push(product)
  $event.preventDefault();
  input.value = '';
}

  get products() {
    return this.form.get('products') as FormArray;
  }

  deleteProduct(index: number) {
    this.products.removeAt(index);
  }

  savePurchaseRequest(){
    
    if (this.form.invalid) { return false; }
    if (this.form.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Si ya verificaste la información y estás de acuerdo, por favor procede.',
        icon: 'question',
        showCancel: true
      }).then(result => {
        if (result.isConfirmed) {
          const data = this.form.value;
          this._solicitudesCompra.savePurchaseRequest(data).subscribe(r=>{ 
            this._swal.show({
              title:'Tarea completada con éxito!',
              text: 'Solicitud de compra creada',
              icon: 'success',
              showCancel: false,
              timer: 3000
            })
            
            this.router.navigateByUrl('/compras/solicitud')
          })
      console.log(this.form.value)
        }else{
          this._swal.show({
            icon: 'error',
            title: '¡Solicitud Cancelada!',
            text: 'La solicitud no ha sido registrada correctamente',
            timer: 3000,
            showCancel: false
          })
        }
      }); 
    }
    
  }

  get category_id_valid(){
    return (
      this.form.get('category_id').invalid && this.form.get('category_id').touched
    );
  }

  get expected_date_valid(){
    return (
      this.form.get('expected_date').invalid && this.form.get('expected_date').touched
    );
  }

  get observations_valid(){
    return (
      this.form.get('observations').invalid && this.form.get('observations').touched
    );
  }

}
