import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datos-nomina',
  templateUrl: './datos-nomina.component.html',
  styleUrls: ['./datos-nomina.component.scss']
})
export class DatosNominaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
