import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertasComunService } from './alertas-comun.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alertas-comun',
  templateUrl: './alertas-comun.component.html',
  styleUrls: ['./alertas-comun.component.scss'],
})
export class AlertasComunComponent implements OnInit {
  @ViewChild('modal') modal: any;
  datas: any[] = [];
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  
  constructor(private _alert: AlertasComunService, private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.getAlerts();
  }

  openModal() {
    this.modal.show();
  }

  getAlerts(page = 1) {
    this.pagination.page = page;
    let person_id = this.route.snapshot.params.pid;
    let param  = person_id  ? {person_id} : {}
    let params = {
      ...param, ...this.pagination
    }
    this._alert.getAlerts(params).subscribe((r: any) => {
      this.datas = r.data.data;
      this.pagination.collectionSize = r.data.total;
    });
  }
}
