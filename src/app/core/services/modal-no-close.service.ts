import { Injectable } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalNoCloseService {
  public modalRefNoClose: any;
  constructor(
    private modalServiceNoClose: NgbModal,
    private config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  openNoClose(contentNoClose, size = 'md', scroll = true) {
    this.modalRefNoClose = this.modalServiceNoClose.open(contentNoClose, {
      ariaLabelledBy: 'modal-basic-title',
      size: size,
      scrollable: scroll,
      backdrop: 'static',
      keyboard: false,
    });
  }
  close() {
    this.modalServiceNoClose.dismissAll();
  }
}
