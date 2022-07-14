import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { ApusService } from '../../core/services/ups.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-get-apus',
  templateUrl: './get-apus.component.html',
  styleUrls: ['./get-apus.component.scss']
})
export class GetApusComponent implements OnInit {

  @ViewChild('modal') modal: any;
  @Output('sendApus') sendApus = new EventEmitter()
  loading = false;
  apus: any[] = []
  state = []
  public href: string = "";

  constructor(
    private _apus: ApusService,
    private router: Router,
    private modalService: NgbModal,
    private platformLocation: PlatformLocation
  ) { }
  ngOnInit(): void {
    this.href = (this.platformLocation as any).location.origin
  }

  closeResult = '';
  public openConfirm() {
    this.loading = true;
    this.state = []
    //  this.modal.show();
    this.getApus()
    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  show() {
    this.loading = true;
    this.state = []
    this.modal.show();
    this.getApus()
  }
  getApus() {
    this._apus.getAll().subscribe((r: any) => {
      this.apus = r.data
      this.loading = false;
    })
  }

  openNewTab(type, id) {
    console.log(type)
    /*  *ngIf="apu.type=='apu_part'">
                                <a [routerLink]="['crm/apu/ver-apu-pieza',1]"  */
    let uri = ''
    switch (type) {
      case 'P':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      case 'C':
        uri = '/crm/apu/ver-apu-conjunto';
        break;
      case 'S':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      default:
        break;
    }
    const url = this.href + `${uri}/${id}` ;   
    
    window.open(url, '_blank');
  }

  setState(apu) {
    apu.selected = !apu.selected
    const index = this.state.findIndex(x => (x.apu_id == apu.apu_id && x.type == apu.type))
    if (index >= 0 && !apu.selected) {
      this.state.splice(index, 1)
    } else {
      this.state.push(apu)
    }

  }

  send() {
    this.sendApus.emit(this.state)
    //this.modal.hide();
    this.modalService.dismissAll();
  }
}
