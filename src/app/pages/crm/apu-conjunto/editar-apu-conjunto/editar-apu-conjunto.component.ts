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
  loading: boolean = true

  constructor(
    private actRoute: ActivatedRoute, private _apuConjunto: ApuConjuntoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.id = this.actRoute?.snapshot?.params?.id;
    await this.getData();
    this.loading = false
  }

  async getData() {
    await this._apuConjunto?.getApuSet(this.id)?.toPromise()?.then((r: any) => {
      this.data = r?.data;
    })
  }

}
