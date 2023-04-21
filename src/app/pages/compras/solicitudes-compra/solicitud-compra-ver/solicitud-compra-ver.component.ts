import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-compra-ver',
  templateUrl: './solicitud-compra-ver.component.html',
  styleUrls: ['./solicitud-compra-ver.component.scss']
})
export class SolicitudCompraVerComponent implements OnInit {
  loading: boolean;
  id: any;
  solicitud: any[] = [];
  datosCabecera: any = {};
  formCotizacionRegular1: FormGroup;

  constructor(
    private route:ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService,
    private _modal: ModalService,
    private fb: FormBuilder
    
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getData();
      this.createFormCotizacionRegular1();
    })
  }
  //Modales
  openModal(content) {
    this._modal.open(content, 'md');
  }

  openModal2(content) {
    this._modal.open(content, 'md');
  }

  createFormCotizacionRegular1(){
    this.formCotizacionRegular1 =this.fb.group({
      Id_Proveedor: [null, Validators.required],
      numero_cotizacion: ['', Validators.required],
      precio_total: ['', Validators.required],
      file: [''],
    })
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
