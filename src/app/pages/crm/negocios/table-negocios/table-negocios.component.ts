import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-table-negocios',
  templateUrl: './table-negocios.component.html',
  styleUrls: ['./table-negocios.component.scss']
})
export class TableNegociosComponent implements OnInit {

  @Input("negocios") negocios: any[]
  @Input("loading") loading: any
  @Input("pagination") pagination: any
  @Output() getNegocios = new EventEmitter<string>();

  constructor(private _negocios: NegociosService,) { }

  ngOnInit(): void {
  }

  nextState(state, id) {
    this._negocios.changeState({ status: state }, id).subscribe();
  }

  getNegociosParent($event) {
    this.getNegocios.emit($event)
  }

}
