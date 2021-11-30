import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-category-stock',
  templateUrl: './category-stock.component.html',
  styleUrls: ['./category-stock.component.scss']
})
export class CategoryStockComponent implements OnInit {

  constructor() { }

  @ViewChild('tablestock') private tablestock;

  @Input('loading') loading;

  nombre:string = '';

  active = 1;

  ngOnInit(): void {
    this.loading = true;
  }

  findName(){

    this.tablestock.getData();
  }

}
