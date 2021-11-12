import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-corte-agua',
  templateUrl: './corte-agua.component.html',
  styleUrls: ['./corte-agua.component.scss']
})
export class CorteAguaComponent implements OnInit {
  @Input('data') cutwater;
  @Input('cut_water_total_amount') cut_water_total_amount;
  @Input('cut_water_unit_subtotal') cut_water_unit_subtotal;
  @Input('cut_water_subtotal') cut_water_subtotal;
  constructor() { }

  ngOnInit(): void {}

}
