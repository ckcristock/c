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
  loading: boolean = true
  constructor(
    private actRoute: ActivatedRoute,
    private _apuPieza: ApuPiezaService
  ) { }

  async ngOnInit(): Promise<void> {
    this.id = this.actRoute?.snapshot?.params?.id;
    await this.getData();
    this.loading = false;
  }

  async getData() {
    await this._apuPieza?.getApuPart(this.id).toPromise().then((r: any) => {
      this.data = r?.data;
    })
  }

}
