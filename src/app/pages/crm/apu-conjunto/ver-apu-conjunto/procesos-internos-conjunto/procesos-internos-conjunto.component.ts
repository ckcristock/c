import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-procesos-internos-conjunto',
  templateUrl: './procesos-internos-conjunto.component.html',
  styleUrls: ['./procesos-internos-conjunto.component.scss']
})
export class ProcesosInternosConjuntoComponent implements OnInit {

  @Input('data') internal;
  @Input('internal_processes_subtotal') internal_processes_subtotal;
  constructor() { }

  ngOnInit(): void {
  }

}
