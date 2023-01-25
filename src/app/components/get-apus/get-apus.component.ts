import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, PlatformLocation } from '@angular/common';
import { ApusService } from 'src/app/pages/crm/apus/apus.service';

@Component({
  selector: 'app-get-apus',
  templateUrl: './get-apus.component.html',
  styleUrls: ['./get-apus.component.scss']
})
export class GetApusComponent implements OnInit {
  @Input('filter') filter:any;
  @ViewChild('modal') modal: any;
  @Output('sendApus') sendApus = new EventEmitter()
  loading = false;
  apus: any[] = []
  state = []
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {
    code: '',
    date_one:'',
    date_two: '',
    name: '',
    city: '',
    client: '',
    line: '',
    type: '',
    description: ''
  }
  public href: string = "";

  constructor(
    //private _apus: ApusService,
    private router: Router,
    private modalService: NgbModal,
    private platformLocation: PlatformLocation,
    private _apu: ApusService
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
    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }

  show() {
    this.loading = true;
    this.state = []
    this.modal.show();
    this.getApus()
  }

  getApus(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filter, ...this.filtros
    }
    this._apu.getApus(params).subscribe((r: any) => {
      this.apus = r.data.data
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  openNewTab(type, id) {
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
    this.modalService.dismissAll();
  }
}
