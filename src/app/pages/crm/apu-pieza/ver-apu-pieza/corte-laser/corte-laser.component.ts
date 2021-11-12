import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-corte-laser',
  templateUrl: './corte-laser.component.html',
  styleUrls: ['./corte-laser.component.scss']
})
export class CorteLaserComponent implements OnInit {
  @Input('data') cutlaser;
  @Input('cut_laser_total_amount') cut_laser_total_amount;
  @Input('cut_laser_unit_subtotal') cut_laser_unit_subtotal;
  @Input('cut_laser_subtotal') cut_laser_subtotal;

  constructor() { }

  ngOnInit(): void {}

}
