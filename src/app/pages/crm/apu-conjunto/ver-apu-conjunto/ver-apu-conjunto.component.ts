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
  id:any;
  data:any;
  isData:boolean = false;
  constructor(
              private _apuConjunto: ApuConjuntoService,
              private actRoute: ActivatedRoute
              ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getApuPart();
  }

  getApuPart(){
    this._apuConjunto.getApuSet(this.id).subscribe((r:any) => {
      this.data = r.data;
      this.isData = true;
    })
  }

  download() {
    this._apuConjunto.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'apu_conjunto_' + this.id + '.pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
    }),
      (error) => {
        console.log('Error downloading the file');
      },
      () => {
        console.info('File downloaded successfully');
      };
  }

}
