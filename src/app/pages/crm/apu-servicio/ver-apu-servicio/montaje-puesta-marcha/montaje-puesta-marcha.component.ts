import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-montaje-puesta-marcha',
  templateUrl: './montaje-puesta-marcha.component.html',
  styleUrls: ['./montaje-puesta-marcha.component.scss']
})
export class MontajePuestaMarchaComponent implements OnInit {
  @Input('data') assemblies_start_up:any;
  collapsed:boolean[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
