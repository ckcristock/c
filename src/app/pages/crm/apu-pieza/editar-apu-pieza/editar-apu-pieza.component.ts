import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-apu-pieza',
  templateUrl: './editar-apu-pieza.component.html',
  styleUrls: ['./editar-apu-pieza.component.scss']
})
export class EditarApuPiezaComponent implements OnInit {
  id: string;
  data: any;
  constructor( private actRoute: ActivatedRoute, private _apuPieza: ApuPiezaService ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getData();
  }

  getData(){
    this._apuPieza.getApuPart(this.id).subscribe((r:any) => {
      this.data = r.data;
    })
  }

}
