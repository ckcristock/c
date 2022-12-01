import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-items-presupuesto',
  templateUrl: './show-items-presupuesto.component.html',
  styleUrls: ['./show-items-presupuesto.component.scss']
})
export class ShowItemsPresupuestoComponent implements OnInit {
  @Input('data') data
  items = []
  shows = {
    indirect_cost: false,
    sum_others: false,
    total_sale: false,
    prorrateo: false
  }
  constructor() { }

  ngOnInit(): void {
    this.items = this.data.items.reduce((acc, el) => [...acc, { ...el, shows: this.shows }], [])
  }

}
