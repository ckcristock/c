import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transporte-terrestre',
  templateUrl: './transporte-terrestre.component.html',
  styleUrls: ['./transporte-terrestre.component.scss']
})
export class TransporteTerrestreComponent implements OnInit {
  @Input('transports') transports :any[]
   constructor() { }

  ngOnInit(): void {
  }

}
