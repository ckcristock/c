import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datos-pila',
  templateUrl: './datos-pila.component.html',
  styleUrls: ['./datos-pila.component.scss']
})
export class DatosPilaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
