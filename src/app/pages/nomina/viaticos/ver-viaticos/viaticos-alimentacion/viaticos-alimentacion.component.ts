import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-viaticos-alimentacion',
  templateUrl: './viaticos-alimentacion.component.html',
  styleUrls: ['./viaticos-alimentacion.component.scss']
})
export class ViaticosAlimentacionComponent implements OnInit {
  @Input('feedings') feedings:any[]
  constructor() { }

  ngOnInit(): void {
  }

}
