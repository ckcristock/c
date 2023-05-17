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
  loading: boolean = true
  constructor(
    private actRoute: ActivatedRoute,
    private _apuPieza: ApuPiezaService
  ) { }

  async ngOnInit(): Promise<void> {
    this.id = this.actRoute?.snapshot?.params?.id;
    await this.getData();
    this.loading = false
  }

  async getData() {
    await this._apuPieza?.getApuPart(this.id)?.toPromise()?.then((r: any) => {
      this.data = r?.data;
    })
  }

}
