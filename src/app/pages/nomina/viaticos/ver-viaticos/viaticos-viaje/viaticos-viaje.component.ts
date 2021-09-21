import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-viaticos-viaje',
  templateUrl: './viaticos-viaje.component.html',
  styleUrls: ['./viaticos-viaje.component.scss']
})
export class ViaticosViajeComponent implements OnInit {
  @Input('data') data:any
  constructor() { }

  ngOnInit(): void {
  }

}
