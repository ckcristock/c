import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TerceroService } from 'src/app/core/services/tercero.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { consts } from 'src/app/core/utils/consts';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-solicitud-compra-ver',
  templateUrl: './solicitud-compra-ver.component.html',
  styleUrls: ['./solicitud-compra-ver.component.scss']
})
export class SolicitudCompraVerComponent implements OnInit {
  mask = consts
  loading: boolean;
  id: any;
  solicitud: any[] = [];
  datosCabecera: any = {};
  formCotizacionRegular: FormGroup;
  formCotizacionGeneral: FormGroup;
  proveedores: any = [];
  filteredProveedor: any[] = [];
  quotations: any[] = [];
  id_producto: any;
  loadingQuotations: boolean;
  quotationSelected: number;


  constructor(
    private route: ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _proveedor: TercerosService,
    private router: Router,
    private _consecutivos: ConsecutivosService,
    private _swal: SwalService,

  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getData();

    })
  }
  //Modal de cargar cotizaciones
  openModal(content, id, general) {
    this.getProveedores();
    this.createFormCotizacion(id, general);
    this.getConsecutivo();
    this._modal.open(content, 'lg');
  }

  //Modal aprobar cotizaciones
  openModal2(content, id, size) {
    this.quotationSelected = undefined;
    this.getQuotationPurchaserequest(id);
    this._modal.open(content, size);
  }


  //Funcion que permite convetir en modal de aprobar a ver
  validate() {
    return this.quotations.some(x => x.status == 'Aprobada')
  }
  // Cargar informacion en el componente ver una vez modales se cierren
  reloadData() {
    this.getData();
  }

  //Formulario de cargar cotizaciones
  createFormCotizacion(id, general) {
    this.formCotizacionRegular = this.fb.group({
      items: this.fb.array([])
    })
    for (let index = 0; index < 3; index++) {
      let item = this.fb.group({
        third_party_id: [null],
        code: [''],
        total_price: [''],
        format_code: [''],
        product_purchase_request_id: [!general ? id : null],
        purchase_request_id: general ? id : null,
        file: ['', index == 0 ? Validators.required : ''],
      })
      item.get('file').valueChanges.subscribe(value => {
        if (value) {
          item.get('total_price').setValidators(Validators.required);
          item.get('third_party_id').setValidators(Validators.required);
        }
      })
      this.items.push(item)
    }
  }

  //Boton brayan pruebas
  printForm() {
    console.log(this.formCotizacionRegular)
  }

  //Funcion que trae los proveedores al formulario de cargar cotizaciones
  getProveedores() {
    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.proveedores = res.data;
      this.filteredProveedor = res.data.slice();
      console.log(this.proveedores)
    });
  }

  //Funcion que re dirige a el usuario a crear el proveedor sino existe en el formulario
  redirectTercero() {
    window.open('/crm/terceros/crear-tercero', '_blank');
  }

  // Crear consecutivos de las cotizaciones
  async getConsecutivo() {
    await this._consecutivos.getConsecutivo('quotation_purchase_requests').toPromise().then((r: any) => {
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.items.controls.forEach((element, index) => {
        element.patchValue({
          code: con + '-' + (index + 1),
          format_code: r.data.format_code
        })
      });
    })
  }


  //Funcion de guardar cotizaciones individuales
  saveQuotation() {
    if (this.formCotizacionRegular.valid) {
      let cont = 0;
      this.items.value.forEach(item => {
        if (item.file) {
          cont++;
        }
      });
      if (cont == 1) {

        this.items.removeAt(2)
        this.items.removeAt(1)
      } else if (cont == 2) {

        this.items.removeAt(2)
      }
      let word = cont == 1 ? ' cotización.' : ' cotizaciones.'
      this._swal.show({
        icon: 'question',
        title: 'Guardar cotización(es)',
        text: 'Vamos a guardar ' + cont + word
      }).then(r => {
        if (r.isConfirmed) {
          this._solicitudesCompra.saveQuotationsPurchaseRequest(this.formCotizacionRegular.value).subscribe((res: any) => {
            this._swal.show({
              title: 'Operación exitosa',
              text: '¡Cotización(es) agregadas con éxito!',
              icon: 'success',
              showCancel: false,
              timer: 1000
            })
            this._modal.close();
            this.formCotizacionRegular.reset()
            this.items.clear();
            this.getData();
          })
        }
      })
    } else {
      this._swal.incompleteError();
    }

  }

  //Funcion que valida el pdf de la cotizacion y lo transforma a base 64
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
        let item = this.items.controls[i];
        item.patchValue({
          file: base64
        })
      });

    }
  }

  //Funcion que trae la informacion del la solicitud a la tabla del componente ver
  getData() {
    this.loading = true;
    this._solicitudesCompra.getDataPurchaseRequest(this.id).subscribe((res: any) => {
      this.solicitud = res.data;
      console.log(this.solicitud)
      this.datosCabecera = {
        Fecha: res.data.created_at,
        Codigo: res.data.code,
        Titulo: res.data.status,
        CodigoFormato: res.data.format_code
      }
      this.loading = false;

    });
  }

  //Funcion que crear el form array de los productos
  get items() {
    return this.formCotizacionRegular.get('items') as FormArray;
  }

  //Funcion que selecciona una cotizacion especifica al hacer clic en  el radio button
  selectedQuotation(id) {
    this.quotationSelected = id;
  }

  //funcion que trae todas las ctoizaciones de un producto especifico
  getQuotationPurchaserequest(id) {
    this.loadingQuotations = true;
    this._solicitudesCompra.getQuotationPurchaserequest(id).subscribe((res: any) => {
      this.quotations = res.data;
      this.loadingQuotations = false;
    })
  }


  // Funcion que guarda cual cotizacion fue aprobada y por medio del back cambia su status a aprobada y las demas a rechazadas
  saveQuotationApproved() {
    if (this.quotationSelected) {
      this._solicitudesCompra.saveQuotationApproved(this.quotationSelected).subscribe((res: any) => {
        this._swal.show({
          title: 'Operación exitosa',
          text: '¡Cotización aprobada con éxito!',
          icon: 'success',
          showCancel: false,
          timer: 1000
        })
        this._modal.close();
        this.reloadData();
      })
    } else {
      this._swal.incompleteError()
    }
  }



}
