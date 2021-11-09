import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';
import { ApuPart, Data } from '../apu-pieza';

@Component({
  selector: 'app-ver-apu-pieza',
  templateUrl: './ver-apu-pieza.component.html',
  styleUrls: ['./ver-apu-pieza.component.scss']
})
export class VerApuPiezaComponent implements OnInit {
  date: Date = new Date();
  id:any;
  data:Data;
 
  constructor( 
                private _apuParts: ApuPiezaService,
                private actRoute: ActivatedRoute
             ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getApuPart();
  }

  getApuPart(){
    this._apuParts.getApuPart(this.id).subscribe((r:ApuPart) => {
      this.data = r.data;
    })
  }
}
