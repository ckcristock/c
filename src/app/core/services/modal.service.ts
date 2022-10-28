import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) { }

  open(content, size = 'md', onclose? : (motivo?:any)=>any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, scrollable: true })
    .result.then((motivo)=>onclose(motivo), (motivo)=>onclose(motivo));
  }
  close() {
    this.modalService.dismissAll();
  }
  openSm(content, onclose? : (motivo?:any)=>any) {
    this.open(content,'sm',onclose);
  }
  openLg(content, onclose? : (motivo?:any)=>any) {
    this.open(content,'lg',onclose);
  }
  openXl(content, onclose? : (motivo?:any)=>any) {
    this.open(content,'xl',onclose );
  }
  openScrollableContent(content, onclose? : (motivo?:any)=>any) {
    this.open(content,'lg',onclose);
  }

  /* open(content, size = 'md') {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, scrollable: true });
  }
  close() {
    this.modalService.dismissAll();
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
  } */
}
