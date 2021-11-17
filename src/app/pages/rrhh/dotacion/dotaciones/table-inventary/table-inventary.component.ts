import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-inventary',
  templateUrl: './table-inventary.component.html',
  styleUrls: ['./table-inventary.component.scss']
})
export class TableInventaryComponent implements OnInit {

  @Input('totalCategory') totalCategory;

  constructor() { }

  ngOnInit(): void {
    console.log(this.totalCategory);

  }

}
