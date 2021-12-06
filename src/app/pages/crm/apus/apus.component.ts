import { Component, OnInit } from '@angular/core';
import { ApusService } from './apus.service';

@Component({
  selector: 'app-apus',
  templateUrl: './apus.component.html',
  styleUrls: ['./apus.component.scss']
})
export class ApusComponent implements OnInit {
  apus:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor( private _apus: ApusService ) { }

  ngOnInit(): void {
    this.getApus();
  }

  getApus(page = 1){
    this.pagination.page = page;
    this.loading = true;
    this._apus.getApus(this.pagination).subscribe((r:any) => {
      this.apus = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
