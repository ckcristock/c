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
  constructor(
    private actRoute: ActivatedRoute,
    private _apuService: ApuServicioService
  ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getData();
  }

  getData() {
    this._apuService.getApuService(this.id).subscribe((r: any) => {
      this.data = r.data;
    })
  }

}
