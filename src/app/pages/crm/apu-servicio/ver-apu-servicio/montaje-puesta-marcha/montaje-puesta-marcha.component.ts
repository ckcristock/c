import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-montaje-puesta-marcha',
  templateUrl: './montaje-puesta-marcha.component.html',
  styleUrls: ['./montaje-puesta-marcha.component.scss']
})
export class MontajePuestaMarchaComponent implements OnInit {
  @Input('data') assemblies_start_up: any;
  @Input('subtotal_labor_mpm') subtotal_labor_mpm: any;
  @Input('subtotal_travel_expense_mpm') subtotal_travel_expense_mpm: any;
  @Input('subtotal_assembly_commissioning') subtotal_assembly_commissioning: any;
  constructor() { }

  ngOnInit(): void {
  }

}
