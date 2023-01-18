import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalRef: any;

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig,
  ) {
    config.backdrop = true;
    config.keyboard = true;
  }
  open(content, size = 'md', scroll = true) {
    this.modalRef = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, scrollable: scroll });
  }
  close() {
    /* this.modalService.dismissAll(); */
    this.modalRef.close(this.modalRef);
  }
  openSm(content) {
    this.modalService.open(content, { size: 'sm' });
  }
  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  openXl(content) {
    this.modalService.open(content, { size: 'xl' });
  }
  openScrollableContent(content) {
    this.modalService.open(content, { scrollable: true, size: 'lg' });
  }
}
