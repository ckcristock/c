import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-otros',
  templateUrl: './otros.component.html',
  styleUrls: ['./otros.component.scss']
})
export class OtrosComponent implements OnInit {

  @Input('data') others;
  @Input('others_subtotal') others_subtotal;
  
  constructor() { }

  ngOnInit(): void {}

}
