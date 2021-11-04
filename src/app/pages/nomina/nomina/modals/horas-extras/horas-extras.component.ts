import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-horas-extras',
  templateUrl: './horas-extras.component.html',
  styleUrls: ['./horas-extras.component.scss']
})
export class HorasExtrasComponent implements OnInit {
  @ViewChild('modal') modal : any
  horasExtras :any = {}
  constructor() { }

  ngOnInit(): void {
  }

  show(funcionario){
    this.horasExtras = funcionario.horas_extras;
    this.modal.show();
  }

}
