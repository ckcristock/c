import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material';

@Component({
  selector: 'app-parametros-nomina',
  templateUrl: './parametros-nomina.component.html',
  styleUrls: ['./parametros-nomina.component.scss']
})
export class ParametrosNominaComponent implements OnInit {

  datos:any[] = [];
  searchingPatient;
  searchFailedPatient;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  actualizar=()=>{

  }

}
