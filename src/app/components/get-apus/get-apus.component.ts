import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, PlatformLocation } from '@angular/common';
import { ApusService } from 'src/app/pages/crm/apus/apus.service';
import { combineLatest, from, zip } from 'rxjs';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-get-apus',
  templateUrl: './get-apus.component.html',
  styleUrls: ['./get-apus.component.scss']
})
export class GetApusComponent implements OnInit {
  @Input('filter') filter: any;
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
    date_one: '',
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
    private _apu: ApusService,
    private _swal: SwalService
  ) { }
  ngOnInit(): void {
    this.href = (this.platformLocation as any).location.origin
  }

  closeResult = '';
  multiple: boolean = true;
  public openConfirm(multiple = true) {
    this.loading = true;
    this.state = []
    this.multiple = multiple;
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
      this.apus.forEach(apu => {
        this.state.forEach(sta => {
          if (sta.apu_id == apu.apu_id && sta.type == apu.type) {
            apu.selected = true
          }
        });
      });
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
    const url = this.href + `${uri}/${id}`;

    window.open(url, '_blank');
  }

  /* setState(apu) {
    apu.selected = !apu.selected
    const index = this.state.findIndex(x => (x.apu_id == apu.apu_id && x.type == apu.type))
    if (index >= 0 && !apu.selected) {
      this.state.splice(index, 1)
    } else {
      this.state.push(apu)
    }
  } */

  setState(apu, event) {
    if (apu.selected && !this.multiple && this.state.length === 1) {
      apu.selected = false
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Solo puedes seleccionar un APU',
        showCancel: false
      });
    } else {
      const index = this.state.findIndex(x => (x.apu_id === apu.apu_id && x.type === apu.type));
      if (apu.selected) {
        if (!this.multiple) {
          this.state.forEach(item => item.selected = false);
        }
        if (index === -1) {
          this.state.push(apu);
          apu.selected = true
        }
      } else {
        if (index !== -1) {
          this.state.splice(index, 1);
          apu.selected = false
        }
      }
    }
    event.checked = apu.selected
    event.source._checked = apu.selected
  }

  send() {
    this.sendApus.emit(this.state)
    this.modalService.dismissAll();
  }
}
