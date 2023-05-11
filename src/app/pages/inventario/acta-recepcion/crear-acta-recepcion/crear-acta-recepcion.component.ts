import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { consts } from 'src/app/core/utils/consts';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { AbstractControl } from '@angular/forms';


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
  ordenCompra: any[] = [];
  history: any;

  get invoices() {
    return this.form.get('invoices') as FormArray;
  }

  get products_acta() {
    return this.form.get('products_acta') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _swal: SwalService,
    private _actaRecepcion: ActaRecepcionService,
    private _consecutivos: ConsecutivosService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loading = true

    this.createForm();
    console.log(this.invoices.controls);
    this.route.paramMap.subscribe(async params => {
      let p = {
        id: params.get('id'),
        compra: params.get('compra')
      }
      await this.getActaRecepcion(p);
      await this.validate(params.get('id'))
      this.getConsecutivo();
      this.loading = false
    })
  }

  async validate(id) {
    await this._actaRecepcion.validate(id).toPromise().then((res: any) => {
      this.history = res.data;
      this.form.patchValue({
        Id_Acta_Recepcion: (this.history ? this.history.Id_Acta_Recepcion : ''),
        Observaciones: [this.history ? this.history.Observaciones : ''],
        Codigo: [this.history ? this.history.Codigo : ''],
      })
      if (res.data?.facturas.length > 0) {
        res.data.facturas.forEach(invoice => {
          this.addInvoice(invoice)
        });
      }
      if (res.data?.products.length > 0) {
        let indexArray: any[] = [];
        this.products_acta.value.forEach((product, index) => {
          let exist = this.history.products.some(v => v.Id_Producto == product.Id_Producto);
          if (exist) {
            indexArray.push(index)
          }
        });
        indexArray.sort((a, b) => b - a)
        indexArray.forEach(element => {
          this.products_acta.removeAt(element)
        });
        /* res.data.products.forEach(product => {
          this.addProducts(product)
        }); */
      }
    })
  }


  async getActaRecepcion(params) {
    await this._actaRecepcion.getActaRecepcionCompra(params).toPromise().then((res: any) => {
      this.ordenCompra = res.data;

      res.data.products.forEach(element => {
        this.addProducts(element)
      });
    })
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('acta_recepcion').toPromise().then((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code

      if (!this.history) {
        this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.datosCabecera.Codigo = con
      } else {
        this.datosCabecera.Codigo = this.history.Codigo
      }
    })
  }


  // Esto es lo que va a la tabla de 'acta_recepcion'
  createForm() {
    this.form = this.fb.group({
      Id_Acta_Recepcion: (''),
      Observaciones: [''],
      Codigo: [''],
      invoices: this.fb.array([]),
      products_acta: this.fb.array([]),
    });

  }



  // Esto es lo que va a la tabla facturas_acta_recepcion
  addInvoice(invoice = null) {
    let addFactura = this.fb.group({
      Id_Factura_Acta_Recepcion: [invoice ? invoice.Id_Factura_Acta_Recepcion : ''],
      Archivo_Factura: [invoice ? invoice.Archivo_Factura : '', Validators.required],
      Factura: [invoice ? invoice.Factura : '', Validators.required],
      Fecha_Factura: [invoice ? invoice.Fecha_Factura : '', Validators.required],
      //retencion: ['', Validators.required],
    });
    if (invoice && invoice.Id_Factura_Acta_Recepcion) {
      Object.keys(addFactura.controls).forEach(controlName => {
        addFactura.get(controlName).disable();
      })
    }
    this.invoices.push(addFactura);
  }

  // esto va a la tabla de productos_acta_recepcion
  addProducts(element) {
    let add = this.fb.group({
      Id_Producto_Acta_Recepcion: [element.Id_Producto_Acta_Recepcion ? element.Id_Producto_Acta_Recepcion : null],
      Cantidad: [{
        value: 0,
        disabled: true
      }], //  falta crear un validador de checkbox
      Subtotal: [{
        value: 0,
        disabled: true
      }],
      Iva: [{
        value: 0,
        disabled: true
      }],
      Total: [{
        value: 0,
        disabled: true
      }],
      imagen: [element?.product?.Imagen],
      nombre: [element?.product?.Nombre_Comercial],
      unidad: [element?.product?.unit?.name],
      cantidad_: [element?.Cantidad],
      subtotal_: [element?.Subtotal],
      iva_: [element?.Valor_Iva],
      total_: [element?.Total],
      Id_Producto: [element?.product.Id_Producto],
      toAdd: [element.Id_Producto_Acta_Recepcion ? true : false]
      // con imagen, y con campos para la cantidad, el iva y los precios (precio total, precio iva, subtotal sin iva),
      // Subtotal, Impuesto, Precio, Cantidad, Unidad
    })

    const fields = ['Subtotal', 'Cantidad', 'Iva', 'Total'];
    add.get('toAdd').valueChanges.subscribe(value => {
      if (value) {
        fields.forEach(field => add.get(field).enable());
        fields.forEach(field => add.get(field).setValidators([Validators.required]));

      } else {
        fields.forEach(field => add.get(field).disable());
        fields.forEach(field => add.get(field).clearValidators());
        add.patchValue({
          Cantidad: 0,
          Subtotal: 0,
          Iva: 0,
          Total: 0
        });
      }
      fields.forEach(field => add.get(field).updateValueAndValidity());
    })

    this.products_acta.push(add);
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
          let newArray = Array.from(this.products_acta.value).filter((product: any) =>
            product.toAdd == true
          );

          //sacar los que no esten marcados
          const data = {
            selected_products: newArray,
            ...this.form.getRawValue(),
            ...this.ordenCompra
          };
          this._actaRecepcion.save(data).subscribe((r: any) => {
            if (r.status) {
              this._swal.show({
                title: '!Tarea completada con éxito!',
                text: 'Acta de recepción creada con éxito.',
                icon: 'success',
                showCancel: false,
                timer: 1000
              })

              this.router.navigateByUrl('/inventario/acta-recepcion')
            } else {
              this._swal.hardError()
            }
          }, (error) => {
            this._swal.hardError()
          })
        } else {
          this._swal.show({
            icon: 'error',
            title: '¡creación de acta cancelada!',
            text: 'El acta no ha sido registrada correctamente',
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
      const types = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'Solo se permiten archivos PDF, PNG, JPG y JPEG'
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

  printform() {
    console.log(this.form.value)
  }



}
