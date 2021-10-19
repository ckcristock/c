import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
})
export class ModalAlertComponent implements OnInit {
  @ViewChild('alertM') alertM;
  data: any = {};
  constructor() {}

  ngOnInit(): void {}

  show(data) {
    this.data = data;
    this.alertM.show();
  }
}
