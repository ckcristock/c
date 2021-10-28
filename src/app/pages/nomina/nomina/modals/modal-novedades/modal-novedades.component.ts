import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-novedades',
  templateUrl: './modal-novedades.component.html',
  styleUrls: ['./modal-novedades.component.scss']
})
export class ModalNovedadesComponent implements OnInit {
  @ViewChild('modal') modal : any
  novedades :any = {}
  constructor() { }

  ngOnInit(): void {
  }

  show(funcionario){
    this.novedades = funcionario.novedades;
    this.modal.show();
  }

  get hasValues(){
    return  Object.values(this.novedades).length
  }

}
