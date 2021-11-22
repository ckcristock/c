import { Component, Input, OnInit, ViewChild,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dotacion-entradas',
  templateUrl: './dotacion-entradas.component.html',
  styleUrls: ['./dotacion-entradas.component.scss']
})
export class DotacionEntradasComponent implements OnInit {

  @Input('open') open: EventEmitter<any>;
  @ViewChild('modal') modal: any;

  constructor() { }

  ngOnInit(): void {
    this.open.subscribe((r) => {
      if (r?.data) {
        this.modal.show();


      } else {
        // this.createForm();
      }
    });
  }
}
