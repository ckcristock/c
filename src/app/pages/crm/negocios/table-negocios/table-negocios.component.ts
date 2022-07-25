import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-negocios',
  templateUrl: './table-negocios.component.html',
  styleUrls: ['./table-negocios.component.scss']
})
export class TableNegociosComponent implements OnInit {

  @Input("negocios") negocios:any[]
  @Input("loading") loading:any
  

  constructor() { }

  ngOnInit(): void {
  }

}
