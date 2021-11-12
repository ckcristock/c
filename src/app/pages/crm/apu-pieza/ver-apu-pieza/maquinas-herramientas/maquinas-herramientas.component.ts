import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-maquinas-herramientas',
  templateUrl: './maquinas-herramientas.component.html',
  styleUrls: ['./maquinas-herramientas.component.scss']
})
export class MaquinasHerramientasComponent implements OnInit {
  id:any;
  @Input('data') machine;
  @Input('machine_tools_subtotal') machine_tools_subtotal;
  constructor() { }

  ngOnInit(): void {}


}
