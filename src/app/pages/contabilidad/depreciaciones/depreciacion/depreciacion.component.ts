import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-depreciacion',
  templateUrl: './depreciacion.component.html',
  styleUrls: ['./depreciacion.component.scss']
})
export class DepreciacionComponent implements OnInit {

  constructor( private location: Location ) { }

  ngOnInit(): void {
  }

  regresar() {
    this.location.back();
  }

}
