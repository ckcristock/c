import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ActaRecepcionService } from '../acta-recepcion.service';

@Component({
  selector: 'app-crear-acta-recepcion',
  templateUrl: './crear-acta-recepcion.component.html',
  styleUrls: ['./crear-acta-recepcion.component.scss'],
})
export class CrearActaRecepcionComponent implements OnInit {

  purchaseOrder: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _swal: SwalService,
    private _actaRecepcion: ActaRecepcionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let p = {
        codigo: params.get('codigo'),
        compra: params.get('compra')
      }
      this.getActaRecepcion(p);

    })
  }

  getActaRecepcion(params) {
    this._actaRecepcion.getActaRecepcionCompra(params).subscribe((res: any) => {
      this.purchaseOrder = res.data;
    })
  }


}
