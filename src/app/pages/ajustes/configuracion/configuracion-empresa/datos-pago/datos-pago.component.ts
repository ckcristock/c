import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datos-pago',
  templateUrl: './datos-pago.component.html',
  styleUrls: ['./datos-pago.component.scss']
})
export class DatosPagoComponent implements OnInit {
  @ViewChild('modal') modal:any;
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
