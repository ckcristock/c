import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CesantiasService } from '../cesantias.service';

@Component({
  selector: 'app-cesantias-ver',
  templateUrl: './cesantias-ver.component.html',
  styleUrls: ['./cesantias-ver.component.scss']
})
export class CesantiasVerComponent implements OnInit {
  params: any = {};
  severanceService$: any;
  loading: boolean;
  data = {};
  constructor(
    private route: ActivatedRoute,
    private _cesantias: CesantiasService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.params.type = params.type;
      this.params.id = params.id;
      this.getSeverance()
    })
  }

  getSeverance() {
    this.loading = true
    if (this.params.type == 'intereses') {
      this.severanceService$ = this._cesantias.getSeveranceInterest(this.params.id)
    } else if (this.params.type == 'pago') {
      this.severanceService$ = this._cesantias.getSeverance(this.params.id)
    }
    this.severanceService$.subscribe((res: any) => {
      this.data = res.data;
      this.loading = false;
    })
  }

}
