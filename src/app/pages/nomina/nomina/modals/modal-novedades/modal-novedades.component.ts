import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-novedades',
  templateUrl: './modal-novedades.component.html',
  styleUrls: ['./modal-novedades.component.scss']
})
export class ModalNovedadesComponent implements OnInit {
  @ViewChild('modal') modal: any
  @ViewChild('add') add: any
  novedades: any = {}
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
    
  }
  
  show(funcionario) {
    this.novedades = funcionario.novedades;
    //this.modal.show();
    this.openConfirm(this.add)
  }

  get hasValues() {
    return Object.values(this.novedades).length
  }

}
