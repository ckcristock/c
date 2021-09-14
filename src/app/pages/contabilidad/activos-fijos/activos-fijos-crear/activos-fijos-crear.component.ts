import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activos-fijos-crear',
  templateUrl: './activos-fijos-crear.component.html',
  styleUrls: ['./activos-fijos-crear.component.scss']
})
export class ActivosFijosCrearComponent implements OnInit {

  constructor( private location: Location ) { }

  ngOnInit(): void {
  }

  regresar() {
    this.location.back();
  }

}
