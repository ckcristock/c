import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-otros-conjunto',
  templateUrl: './otros-conjunto.component.html',
  styleUrls: ['./otros-conjunto.component.scss']
})
export class OtrosConjuntoComponent implements OnInit {

  @Input('data') others;
  @Input('others_subtotal') others_subtotal;
  constructor() { }

  ngOnInit(): void {
  }

}
