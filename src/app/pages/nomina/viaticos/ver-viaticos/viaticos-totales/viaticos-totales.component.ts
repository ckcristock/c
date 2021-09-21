import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-viaticos-totales',
  templateUrl: './viaticos-totales.component.html',
  styleUrls: ['./viaticos-totales.component.scss']
})
export class ViaticosTotalesComponent implements OnInit {
  @Input('data') data;
  constructor() { }

  ngOnInit(): void {
  }

}
