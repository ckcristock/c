import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-ingresos-no-prestacionales',
  templateUrl: './modal-ingresos-no-prestacionales.component.html',
  styleUrls: ['./modal-ingresos-no-prestacionales.component.scss']
})
export class ModalIngresosNoPrestacionalesComponent implements OnInit {
  @ViewChild('modal') modal : any
  @ViewChild('ingresoForm') ingresoForm : any
  @Input('periodo') periodo :string
  @Input('nominaPaga') nominaPaga :string

  @Output('updated') updated = new EventEmitter<any>();
  showData =false;
  person:any
  constructor() { }

  ngOnInit(): void {
  }

  show(funcionario){
    this.showData = false;
    this.person = funcionario
    this.showData = true;

    this.modal.show();
  }
  update(){
    this.updated.emit();
  }
}
