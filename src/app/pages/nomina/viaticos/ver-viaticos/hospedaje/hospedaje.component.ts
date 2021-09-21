import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hospedaje',
  templateUrl: './hospedaje.component.html',
  styleUrls: ['./hospedaje.component.scss']
})
export class HospedajeComponent implements OnInit {
  @Input('hotels') hotels :any[]

  constructor() { }

  ngOnInit(): void {
  }

}
