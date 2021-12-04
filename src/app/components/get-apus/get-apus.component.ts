import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalBasicComponent } from '../modal-basic/modal-basic.component';
import { ApusService } from '../../core/services/ups.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-apus',
  templateUrl: './get-apus.component.html',
  styleUrls: ['./get-apus.component.scss']
})
export class GetApusComponent implements OnInit {

  @ViewChild('modal') modal: ModalBasicComponent
  @Output('sendApus') sendApus = new EventEmitter()
  loading = false;
  apus: any[] = []
  state = []

  constructor(private _apus: ApusService, private router: Router) { }
  ngOnInit(): void {
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

  openNewTab(type,id) {
    /*  *ngIf="apu.type=='apu_part'">
                                <a [routerLink]="['crm/apu/ver-apu-pieza',1]"  */
    let uri = ''
    switch (type) {
      case 'apu_part':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      case 'apu_set':
        uri = '/crm/apu/ver-apu-conjunto';
        break;
      case 'apu_service':
        uri = 'crm/apu/ver-apu-pieza';
        break;
      default:
        break;
    }
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${uri}/${id}`])
    );
    window.open(url, '_blank');
  }

  setState(  apu   ){
    apu.selected = !apu.selected
    const index = this.state.findIndex(x=> ( x.apu_id == apu.apu_id && x.type == apu.type ) )
    if (index >= 0 && !apu.selected) {
          this.state.splice(index,1)
    }else{
        this.state.push(apu)
    }
    
  }

  send(){
    this.sendApus.emit(this.state)
    this.modal.hide();
  }
}
