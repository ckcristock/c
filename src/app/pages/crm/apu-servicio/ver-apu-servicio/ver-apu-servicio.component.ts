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
  donwloading = false;
  download() {
    this.donwloading = true;
    this._apuServicio.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'apu_servicio_' + this.id;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloading = false;
    }),
      (error) => {
        console.log('Error downloading the file');
        this.donwloading = false;
      },
      () => {
        this.donwloading = false;
        console.info('File downloaded successfully');
      };
  }
}
