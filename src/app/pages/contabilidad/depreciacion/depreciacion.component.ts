import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss']
})
export class DepreciacionComponent implements OnInit {

  public DatosCabecera = {
    Titulo: 'Depreciación de Activos Fijos',
    Fecha: new Date(),
    Codigo:''
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
