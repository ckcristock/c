import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-import-commercial-puc',
  templateUrl: './import-commercial-puc.component.html',
  styleUrls: ['./import-commercial-puc.component.scss']
})
export class ImportCommercialPucComponent implements OnInit {
  @ViewChild('modal') modal;
  view: boolean;
  constructor(
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
  }

  open() {
    this._modal.open(this.modal, 'lg')
  }

  save() {

  }

}
