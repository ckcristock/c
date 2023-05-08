import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';

@Component({
  selector: 'app-crear-acta-recepcion',
  templateUrl: './crear-acta-recepcion.component.html',
  styleUrls: ['./crear-acta-recepcion.component.scss'],
})
export class CrearActaRecepcionComponent implements OnInit {
  mask = consts
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
      res.data.products.forEach(element => {
        this.addProducts(element)
      });
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
      //retencion: ['', Validators.required],
    }));
  }

  // esto va a la tabla de productos_acta_recepcion
  addProducts(element) {
    this.products.push(this.fb.group({
      Cantidad: ['1', Validators.min(1)],
      Subtotal: '',
      Impuesto: '',
      Precio: '',
      imagen: [element?.product?.Imagen],
      nombre: [element?.product?.Nombre_Comercial],
      unidad: [element?.product?.unit?.name]
      // con imagen, y con campos para la cantidad, el iva y los precios (precio total, precio iva, subtotal sin iva),
      // Subtotal, Impuesto, Precio, Cantidad, Unidad
    }));
  }

  removeInvoice(index: number) {
    this.invoices.removeAt(index);
  }

  saveActa() {
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
          };
          this._actaRecepcion.save(data).subscribe(r => {
            this._swal.show({
              title: '!Tarea completada con éxito!',
              text: 'Acta de recepción creada con éxito.',
              icon: 'success',
              showCancel: false,
              timer: 1000
            })

            this.router.navigateByUrl('/inventario/acta-recepcion')
          })
          console.log(this.form.value)
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

  onFileChanged(event, i) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      const types = ['application/pdf']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        let invoice = this.invoices.controls[i];
        invoice.patchValue({
          Archivo_Factura: base64
        })
      });

    }
  }

}
