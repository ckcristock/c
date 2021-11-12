import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})
export class SalarioComponent implements OnInit {

  @Input("funcionario") funcionario ;
  @Input("salarioDatos") salarioDatos;
  @Input("datosEmpresa") datosEmpresa ;
  @Input("brand") brand ;

  constructor() { }

  ngOnInit(): void {
  }

}
