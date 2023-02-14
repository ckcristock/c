import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuServicioService } from '../apu-servicio.service';

@Component({
  selector: 'app-editar-apu-servicio',
  templateUrl: './editar-apu-servicio.component.html',
  styleUrls: ['./editar-apu-servicio.component.scss']
})
export class EditarApuServicioComponent implements OnInit {
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
