import { Component, OnInit } from '@angular/core';
import { ApuServicioService } from '../apu-servicio.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-apu-servicio',
  templateUrl: './ver-apu-servicio.component.html',
  styleUrls: ['./ver-apu-servicio.component.scss']
})
export class VerApuServicioComponent implements OnInit {

  date: Date = new Date();
  id: any;
  data: any;
  loading: boolean = false;
  datosCabecera = {
    Titulo: 'APU SERVICIO',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  constructor(
    private _apuServicio: ApuServicioService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getApuService();
  }

  getApuService() {
    this.loading = true;
    this._apuServicio.getApuService(this.id).subscribe((r: any) => {
      this.data = r.data;
      this.datosCabecera.Codigo = r.data.code;
      this.datosCabecera.Fecha = r.data.created_at;
      this.datosCabecera.CodigoFormato = r.data.format_code;
      this.loading = false;
    })
  }
}
