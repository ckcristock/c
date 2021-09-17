import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-depreciaciones',
  templateUrl: './depreciaciones.component.html',
  styleUrls: ['./depreciaciones.component.scss']
})
export class DepreciacionesComponent implements OnInit {
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor() { }

  ngOnInit(): void {
  }

}
