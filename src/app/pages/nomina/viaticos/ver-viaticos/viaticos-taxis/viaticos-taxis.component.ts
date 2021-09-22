import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-viaticos-taxis',
  templateUrl: './viaticos-taxis.component.html',
  styleUrls: ['./viaticos-taxis.component.scss']
})
export class ViaticosTaxisComponent implements OnInit {

  @Input('data') data:any
  constructor() { }

  ngOnInit(): void {
  }

}
