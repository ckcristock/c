import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TerceroService } from 'src/app/core/services/tercero.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { consts } from 'src/app/core/utils/consts';


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
  proveedores: any = [];
  filteredProveedor: any[] = [];


  constructor( 
    private route:ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _proveedor: TercerosService,
    private router: Router,
    
    
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getData();
      this.createFormCotizacionRegular();
      this.getProveedores();
      
    })
  }
  //Modales
  openModal(content) {
    this._modal.open(content, 'lg');
  }

  openModal2(content) {
    this._modal.open(content, 'lg');
  }

  createFormCotizacionRegular(){
    this.formCotizacionRegular = this.fb.group({
      items: this.fb.array([])
    })
    let items = this.formCotizacionRegular.get('items') as FormArray;
    for (let index = 0; index < 3; index++) {
      items.push(
        this.fb.group({
          Id_Proveedor: [null, Validators.required],
          numero_cotizacion: ['', Validators.required],
          precio_total: ['', Validators.required],
          file: [''],
        })
      )
      
    }
  }

  printForm(){
    console.log(this.formCotizacionRegular)
  }

  getProveedores() {
    this._proveedor.getThirdPartyProvider({}).subscribe((res: any) => {
      this.proveedores = res.data;
      this.filteredProveedor = res.data.slice();
    });
  }

  redirectTercero(){ 
    window.open('/crm/terceros/crear-tercero', '_blank');
  }

  saveCotizacion(){

  }
  
  //Fin modales
  getData(){
    this.loading = true;
    let params = {
      id: this.id
    }
    this._solicitudesCompra.getDatosPurchaseRequest(params).subscribe((res: any) => {
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

}
