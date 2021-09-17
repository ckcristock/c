import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-configuracion-empresa',
  templateUrl: './configuracion-empresa.component.html',
  styleUrls: ['./configuracion-empresa.component.scss']
})
export class ConfiguracionEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  constructor() { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

}
