import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-procesos-externos',
  templateUrl: './procesos-externos.component.html',
  styleUrls: ['./procesos-externos.component.scss']
})
export class ProcesosExternosComponent implements OnInit {
  @Input('data') external;
  @Input('external_proccesses_subtotal') external_proccesses_subtotal;
  
  constructor() { }

  ngOnInit(): void {
  }

}
