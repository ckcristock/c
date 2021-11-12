import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-procesos-internos',
  templateUrl: './procesos-internos.component.html',
  styleUrls: ['./procesos-internos.component.scss']
})
export class ProcesosInternosComponent implements OnInit {
  @Input('data') internal;
  @Input('internal_proccesses_subtotal') internal_proccesses_subtotal;
  
  constructor() { }

  ngOnInit(): void {
  }

}
