import { Component, Input, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-materiales-comerciales',
  templateUrl: './materiales-comerciales.component.html',
  styleUrls: ['./materiales-comerciales.component.scss']
})
export class MaterialesComercialesComponent implements OnInit {
  id:any;
  @Input('data') comercials;
  @Input('commercial_materials_subtotal') commercial_materials_subtotal;
  constructor(
              ) { }

  ngOnInit(): void {
  }
}
