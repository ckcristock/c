import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-inventary-epp',
  templateUrl: './table-inventary-epp.component.html',
  styleUrls: ['./table-inventary-epp.component.scss']
})
export class TableInventaryEppComponent implements OnInit {

  @Input('totalCategory') totalCategory;

  constructor() { }

  ngOnInit(): void {
  }

}
