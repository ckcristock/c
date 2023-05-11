import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuServicioService } from '../apu-servicio.service';

@Component({
  selector: 'app-copiar-apu-servicio',
  templateUrl: './copiar-apu-servicio.component.html',
  styleUrls: ['./copiar-apu-servicio.component.scss']
})
export class CopiarApuServicioComponent implements OnInit {
  id: string;
  data: any;
  loading: boolean = true
  constructor(
    private actRoute: ActivatedRoute,
    private _apuService: ApuServicioService
  ) { }

  async ngOnInit(): Promise<void> {
    this.id = this.actRoute?.snapshot?.params?.id;
    await this.getData();
    this.loading = false
  }

  async getData() {
    await this._apuService.getApuService(this.id).toPromise().then((r: any) => {
      this.data = r?.data;
    })
  }

}
