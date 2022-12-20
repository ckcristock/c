import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TercerosService } from '../terceros.service';

@Component({
  selector: 'app-view-third',
  templateUrl: './view-third.component.html',
  styleUrls: ['./view-third.component.scss']
})
export class ViewThirdComponent implements OnInit {
  third_id;
  third_data;
  constructor(
    private _tercero: TercerosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.third_id = params.get('id');
      this.getThird();
    })
  }

  getThird() {
    this._tercero.showThirdParty(this.third_id).subscribe((res:any) => {
      this.third_data = res.data
    })
  }

}
