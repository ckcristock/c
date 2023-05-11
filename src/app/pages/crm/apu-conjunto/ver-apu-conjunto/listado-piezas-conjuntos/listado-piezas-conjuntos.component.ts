import { PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-listado-piezas-conjuntos',
  templateUrl: './listado-piezas-conjuntos.component.html',
  styleUrls: ['./listado-piezas-conjuntos.component.scss']
})
export class ListadoPiezasConjuntosComponent implements OnInit {
  @Input('data') pieces_sets;
  @Input('list_pieces_sets_subtotal') list_pieces_sets_subtotal;
  constructor(private platformLocation: PlatformLocation) { }
  href: string = "";
  ngOnInit(): void {
    this.href = (this.platformLocation as any).location.origin;
  }

  openInNewTab(item) {
    let uri = ''
    let id;
    switch (item.apu_type) {
      case 'P':
        uri = '/crm/apu/ver-apu-pieza';
        id = item.apupart.id
        break;
      case 'C':
        uri = '/crm/apu/ver-apu-conjunto';
        id = item.apuset.id
        break;
      default:
        break;
    }
    const url = this.href + `${uri}/${id}`;

    window.open(url, '_blank');
  }

}
