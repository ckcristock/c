import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-maquinas-herramientas-conjunto',
  templateUrl: './maquinas-herramientas-conjunto.component.html',
  styleUrls: ['./maquinas-herramientas-conjunto.component.scss']
})
export class MaquinasHerramientasConjuntoComponent implements OnInit {

  @Input('data') machine;
  @Input('machine_tools_subtotal') machine_tools_subtotal;
  constructor() { }

  ngOnInit(): void {
  }

}
