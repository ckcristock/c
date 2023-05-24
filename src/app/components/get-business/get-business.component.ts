import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-get-business',
  templateUrl: './get-business.component.html',
  styleUrls: ['./get-business.component.scss']
})
export class GetBusinessComponent implements OnInit {
  @ViewChild('modal') modal;
  constructor(
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this._modal.open(this.modal)
  }

}
