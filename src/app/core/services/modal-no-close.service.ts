import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalNoCloseService {
  public modalRef: any;
  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  open(content, size = 'md', scroll = true) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, scrollable: scroll });
  }
  close() {
    this.modalService.dismissAll();
    /* this.modalRef.dismiss(this.modalRef); */
  }
}
