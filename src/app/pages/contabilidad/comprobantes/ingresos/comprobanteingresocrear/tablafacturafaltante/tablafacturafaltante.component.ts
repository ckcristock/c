import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tablafacturafaltante',
  templateUrl: './tablafacturafaltante.component.html',
  styleUrls: ['./tablafacturafaltante.component.scss']
})
export class TablafacturafaltanteComponent implements OnInit {
  @Input() Facturas_Faltantes;
  constructor() { }

  ngOnInit(): void {
  }

}
