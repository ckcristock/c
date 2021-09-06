import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-arl',
  templateUrl: './arl.component.html',
  styleUrls: ['./arl.component.scss']
})
export class ArlComponent implements OnInit {
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
