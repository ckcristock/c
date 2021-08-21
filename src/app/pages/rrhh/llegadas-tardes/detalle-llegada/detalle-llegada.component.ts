import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalle-llegada',
  templateUrl: './detalle-llegada.component.html',
  styleUrls: ['./detalle-llegada.component.scss']
})
export class DetalleLlegadaComponent implements OnInit {
  @Input('person') person : any
  constructor() { }

  ngOnInit(): void {
  }

}
