import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-datos-basicos-empresa',
  templateUrl: './datos-basicos-empresa.component.html',
  styleUrls: ['./datos-basicos-empresa.component.scss']
})
export class DatosBasicosEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
