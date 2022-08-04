import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss']
})
export class DepreciacionComponent implements OnInit {

  public DatosCabecera = {
    Titulo: 'Depreciación de activos fijos',
    Fecha: new Date(),
    Codigo:''
  }
  
  constructor() { }

  ngOnInit(): void {
  }
  estadoFiltros = false;
  mostrarFiltros(){
    this.estadoFiltros = !this.estadoFiltros
  }
}
