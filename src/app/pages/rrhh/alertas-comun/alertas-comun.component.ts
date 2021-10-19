import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alertas-comun',
  templateUrl: './alertas-comun.component.html',
  styleUrls: ['./alertas-comun.component.scss']
})
export class AlertasComunComponent implements OnInit {
  @ViewChild('modal') modal:any;
  datas:any = [
    {
      name: 'Julio Andres Perez Medina',
      detail: 'Se ha eliminado el acta de entrega de la dispensacion: por el siguiente motivo: DIS785880 - cambio por favor vuelva adjuntar el acta!',
      date: '05/06/12',
      type: 'LLegada Tarde'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  openModal(){
    this.modal.show();
  }

}
