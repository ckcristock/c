import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuPiezaService } from '../apu-pieza.service';

@Component({
  selector: 'app-copiar-apu-pieza',
  templateUrl: './copiar-apu-pieza.component.html',
  styleUrls: ['./copiar-apu-pieza.component.scss']
})
export class CopiarApuPiezaComponent implements OnInit {
  id: string;
  data: any;
  constructor(
    private actRoute: ActivatedRoute,
    private _apuPieza: ApuPiezaService
  ) { }

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
