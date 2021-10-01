import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activos-fijos-ver',
  templateUrl: './activos-fijos-ver.component.html',
  styleUrls: ['./activos-fijos-ver.component.scss']
})
export class ActivosFijosVerComponent implements OnInit {
  date: Date = new Date();
  constructor( private location: Location ) { }

  ngOnInit(): void {
  }

  regresar() {
    this.location.back();
  }

}
