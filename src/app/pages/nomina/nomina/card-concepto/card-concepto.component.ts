import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-concepto',
  templateUrl: './card-concepto.component.html',
  styleUrls: ['./card-concepto.component.scss']
})
export class CardConceptoComponent implements OnInit {
  @Input('concepto') concepto: number;
  @Input('icon') icon: string;
  @Input('label') label: string;


  constructor() { }

  ngOnInit(): void {
  }

}
