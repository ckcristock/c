import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-ingresos-prestacionales',
  templateUrl: './modal-ingresos-prestacionales.component.html',
  styleUrls: ['./modal-ingresos-prestacionales.component.scss']
})
export class ModalIngresosPrestacionalesComponent implements OnInit {
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
    console.log('payyyyyyyyyyyy');
    this.updated.emit();
  }
}
