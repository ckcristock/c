import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-ingresos-prestacionales',
  templateUrl: './modal-ingresos-prestacionales.component.html',
  styleUrls: ['./modal-ingresos-prestacionales.component.scss']
})
export class ModalIngresosPrestacionalesComponent implements OnInit {
  @ViewChild('modal') modal: any
  @ViewChild('add') add: any
  @ViewChild('ingresoForm') ingresoForm: any
  @Input('periodo') periodo: string
  @Input('nominaPaga') nominaPaga: string

  @Output('updated') updated = new EventEmitter<any>();
  showData = false;
  person: any
  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.showData = false
    
  }

  show(funcionario) {
    this.showData = false;
    this.person = funcionario
    this.showData = true;
    this.openConfirm(this.add)
    //this.modal.show();
  }
  update() {
    console.log('payyyyyyyyyyyy');
    this.updated.emit();
  }
}
