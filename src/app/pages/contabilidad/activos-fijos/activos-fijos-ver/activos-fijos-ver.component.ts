import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activos-fijos-ver',
  templateUrl: './activos-fijos-ver.component.html',
  styleUrls: ['./activos-fijos-ver.component.scss']
})
export class ActivosFijosVerComponent implements OnInit {
  public Datos:any={
    Titulo:'Activo Fijo',
    Fecha:new Date()
  }
  public id = this.route.snapshot.params["id"];
  date: Date = new Date();
  constructor( private location: Location, private route: ActivatedRoute ) { }
  
  ngOnInit(): void {
  }

  regresar() {
    this.location.back();
  }

}
