import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-materia-prima',
  templateUrl: './materia-prima.component.html',
  styleUrls: ['./materia-prima.component.scss']
})
export class MateriaPrimaComponent implements OnInit {
  id:any;
  @Input('data') rawMateria;
  @Input('subtotal_raw_material') subtotal_raw_material;
  constructor() { }

  ngOnInit(): void {
  }

}
