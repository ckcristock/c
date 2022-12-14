import { Component, Input, OnInit } from '@angular/core';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-table-negocios',
  templateUrl: './table-negocios.component.html',
  styleUrls: ['./table-negocios.component.scss']
})
export class TableNegociosComponent implements OnInit {

  @Input("negocios") negocios: any[]
  @Input("loading") loading: any


  constructor(private _negocios: NegociosService,) { }

  ngOnInit(): void {
  }

  nextState(state, id) {
    console.log(state)
    this._negocios.changeState({ status: state }, id).subscribe();

  }

}
