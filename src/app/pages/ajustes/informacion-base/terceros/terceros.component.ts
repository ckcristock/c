import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor() { }

  ngOnInit(): void {
  }

}
