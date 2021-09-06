import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fondo-pension',
  templateUrl: './fondo-pension.component.html',
  styleUrls: ['./fondo-pension.component.scss']
})
export class FondoPensionComponent implements OnInit {
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
