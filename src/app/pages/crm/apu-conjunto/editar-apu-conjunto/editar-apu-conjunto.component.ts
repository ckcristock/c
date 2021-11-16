import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { ApuConjuntoService } from '../apu-conjunto.service';

@Component({
  selector: 'app-editar-apu-conjunto',
  templateUrl: './editar-apu-conjunto.component.html',
  styleUrls: ['./editar-apu-conjunto.component.scss']
})
export class EditarApuConjuntoComponent implements OnInit {
  id: string;
  data: any;

  constructor(
              private actRoute: ActivatedRoute, private _apuConjunto: ApuConjuntoService
              ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getData();
  }

  getData(){
    this._apuConjunto.getApuSet(this.id).subscribe((r:any) => {
      this.data = r.data;
    })
  }

}
