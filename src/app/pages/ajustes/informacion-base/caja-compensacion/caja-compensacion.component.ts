import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-caja-compensacion',
  templateUrl: './caja-compensacion.component.html',
  styleUrls: ['./caja-compensacion.component.scss']
})
export class CajaCompensacionComponent implements OnInit {
  @ViewChild('modal') modal:any;
  pagination:any = {
    page: 5,
    pageSize: 1,
    collectionSize: 0
  }
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
