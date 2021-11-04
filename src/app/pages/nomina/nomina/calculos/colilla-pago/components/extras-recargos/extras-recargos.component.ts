import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extras-recargos',
  templateUrl: './extras-recargos.component.html',
  styleUrls: ['./extras-recargos.component.scss']
})
export class ExtrasRecargosComponent implements OnInit {
  
  @Input('horasExtrasDatos') horasExtrasDatos 
  @Input('porcentajesExtrasDatos') porcentajesExtrasDatos 
  @Input('funcionario') funcionario 

  constructor() { }

  ngOnInit(): void {
  }

}
