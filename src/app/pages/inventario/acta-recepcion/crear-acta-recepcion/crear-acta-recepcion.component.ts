import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-acta-recepcion',
  templateUrl: './crear-acta-recepcion.component.html',
  styleUrls: ['./crear-acta-recepcion.component.scss'],
})
export class CrearActaRecepcionComponent implements OnInit {

  purchaseOrder: any[] = [];
  loading: boolean = false;
  datosCabecera = {
    Titulo: 'Nueva acta de recepción',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: ''
  }
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _swal: SwalService,
    private _actaRecepcion: ActaRecepcionService,
    private _consecutivos: ConsecutivosService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.paramMap.subscribe(params => {
      let p = {
        codigo: params.get('codigo'),
        compra: params.get('compra')
      }
      this.getActaRecepcion(p);
      this.getConsecutivo();

    })
  }

  getActaRecepcion(params) {
    this._actaRecepcion.getActaRecepcionCompra(params).subscribe((res: any) => {
      this.purchaseOrder = res.data;
    })
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('acta_recepcion').toPromise().then((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con
      // if (!this.dataEdit && !this.id) {
      //   this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      //   let con = this._consecutivos.construirConsecutivo(r.data);
      //   this.datosCabecera.Codigo = con
      // } else {
      //   this.datosCabecera.Codigo = this.dataEdit.code
      // }
    })
  }
  // Esto es lo que va a la tabla de 'acta_recepcion'
  createForm() {
    this.form = this.fb.group({
      invoices: this.fb.array([]),
      products: this.fb.array([]),
      Observaciones: '',
    });

  }

  get invoices() {
    return this.form.get('invoices') as FormArray;
  }

  get products() {
    return this.form.get('products') as FormArray;
  }

  // Esto es lo que va a la tabla facturas_acta_recepcion
  addInvoice() {
    this.invoices.push(this.fb.group({
      Archivo_Factura: ['', Validators.required],
      Factura: ['', Validators.required],
      Fecha_Factura: ['', Validators.required],
      retencion: ['', Validators.required],
    }));
  }

  // esto va a la tabla de productos_acta_recepcion
  addProducts() {
    this.products.push(this.fb.group({}));
  }

  removeInvoice(index: number) {
    this.invoices.removeAt(index);
  }
}
