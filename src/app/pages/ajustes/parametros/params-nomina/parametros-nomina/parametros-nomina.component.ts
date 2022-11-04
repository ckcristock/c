import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parametros-nomina',
  templateUrl: './parametros-nomina.component.html',
  styleUrls: ['./parametros-nomina.component.scss']
})
export class ParametrosNominaComponent implements OnInit {

  datos:any[] = [];
  searchingPatient;
  searchFailedPatient;

  constructor() { }

  ngOnInit(): void {
  }

  actualizar=()=>{

  }

}
