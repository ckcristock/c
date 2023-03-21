import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { ActivatedRoute } from '@angular/router';
import { ApuConjuntoService } from '../apu-conjunto.service';

@Component({
  selector: 'app-ver-apu-conjunto',
  templateUrl: './ver-apu-conjunto.component.html',
  styleUrls: ['./ver-apu-conjunto.component.scss']
})
export class VerApuConjuntoComponent implements OnInit {
  date: Date = new Date();
  id: any;
  data: any;
  isData: boolean = false;
  loading: boolean = false;
  datosCabecera = {
    Titulo: 'APU CONJUNTO',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  constructor(
    private _apuConjunto: ApuConjuntoService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getApuPart();
  }

  getApuPart() {
    this.loading = true;
    this._apuConjunto.getApuSet(this.id).subscribe((r: any) => {
      this.data = r.data;
      this.datosCabecera.Codigo = r.data.code;
      this.datosCabecera.Fecha = r.data.created_at;
      this.datosCabecera.CodigoFormato = r.data.format_code;
      this.isData = true;
      this.loading = false;
    })
  }

  donwloading = false;

  download() {
    this.donwloading = true;
    this._apuConjunto.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'apu_conjunto_' + this.id;
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
        console.info('File downloaded successfully');
        this.donwloading = false;
      };
  }

}
