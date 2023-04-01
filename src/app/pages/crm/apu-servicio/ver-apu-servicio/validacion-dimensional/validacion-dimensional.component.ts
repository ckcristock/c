import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validacion-dimensional',
  templateUrl: './validacion-dimensional.component.html',
  styleUrls: ['./validacion-dimensional.component.scss']
})
export class ValidacionDimensionalComponent implements OnInit {
  @Input('data') dimensional_validation;
  @Input('subtotal_labor') subtotal_labor;
  @Input('subtotal_travel_expense') subtotal_travel_expense;
  @Input('subtotal_dimensional_validation') subtotal_dimensional_validation;

  constructor() { }

  ngOnInit(): void {
  }

}
