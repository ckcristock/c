import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { Observable, OperatorFunction, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { consts } from 'src/app/core/utils/consts';

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
    private _solicitudesCompra: SolicitudesCompraService
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

}
