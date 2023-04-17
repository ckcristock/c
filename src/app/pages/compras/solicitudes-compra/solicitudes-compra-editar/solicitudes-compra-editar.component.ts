import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solicitudes-compra-editar',
  templateUrl: './solicitudes-compra-editar.component.html',
  styleUrls: ['./solicitudes-compra-editar.component.scss']
})
export class SolicitudesCompraEditarComponent implements OnInit {
  id: number;
  data: any[] = []
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getData()
    })
  }

  getData() {
    
  }

}
