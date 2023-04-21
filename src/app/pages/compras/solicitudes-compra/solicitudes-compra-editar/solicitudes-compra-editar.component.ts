import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SolicitudesCompraService } from '../solicitudes-compra.service';

@Component({
  selector: 'app-solicitudes-compra-editar',
  templateUrl: './solicitudes-compra-editar.component.html',
  styleUrls: ['./solicitudes-compra-editar.component.scss']
})
export class SolicitudesCompraEditarComponent implements OnInit {
  id: number;
  data: any[] = []
  loading = false
  constructor(
    private route: ActivatedRoute,
    private _solicitudesCompra: SolicitudesCompraService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getData()
    })
  }

  getData() {
    this.loading = true
    this._solicitudesCompra.get(this.id).subscribe((r:any) => {
      this.data = r.data;
      this.loading = false
      console.log(this.data)
    })
  }

}

