import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-procesos-externos-conjunto',
  templateUrl: './procesos-externos-conjunto.component.html',
  styleUrls: ['./procesos-externos-conjunto.component.scss']
})
export class ProcesosExternosConjuntoComponent implements OnInit {

  @Input('data') external;
  @Input('external_processes_subtotal') external_processes_subtotal;
  constructor() { }

  ngOnInit(): void {
  }

}
