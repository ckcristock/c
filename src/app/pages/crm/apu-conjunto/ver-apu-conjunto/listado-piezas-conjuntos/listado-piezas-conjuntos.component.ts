import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-piezas-conjuntos',
  templateUrl: './listado-piezas-conjuntos.component.html',
  styleUrls: ['./listado-piezas-conjuntos.component.scss']
})
export class ListadoPiezasConjuntosComponent implements OnInit {
  @Input('data') pieces_sets;
  @Input('list_pieces_sets_subtotal') list_pieces_sets_subtotal;
  constructor() { }

  ngOnInit(): void {

  }

}
