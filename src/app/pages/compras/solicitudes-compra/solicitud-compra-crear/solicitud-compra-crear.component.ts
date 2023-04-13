import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-solicitud-compra-crear',
  templateUrl: './solicitud-compra-crear.component.html',
  styleUrls: ['./solicitud-compra-crear.component.scss']
})
export class SolicitudCompraCrearComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  searching: boolean;
  searchFailed: boolean;
  masks = consts;
  datosCabecera = {
    Titulo: 'Nueva solicitud de compra',
    Fecha: new Date()
  }
  constructor(
    private fb: FormBuilder,
    private _solicitudesCompra: SolicitudesCompraService,
    private _swal: SwalService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCategoryForSelect()
  }

  getCategoryForSelect() {
    this._solicitudesCompra.getCategoryForSelect().subscribe((res: any) => {
      this.categories = res.data;
    })
  }

  view(){
    console.log(this.form)
  }

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
                tap(() => (this.searchFailed = false)),
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
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Si ya verificó la información y está de acuerdo, por favor proceda.',
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
          //this._modal.close();
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

  prueba(){
    console.log('click')
  }

}
