import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from '../apu-pieza.service';
import { ActivatedRoute } from '@angular/router';
import { ApuPart, Data } from '../apu-pieza';

@Component({
  selector: 'app-ver-apu-pieza',
  templateUrl: './ver-apu-pieza.component.html',
  styleUrls: ['./ver-apu-pieza.component.scss']
})
export class VerApuPiezaComponent implements OnInit {
  date: Date = new Date();
  id:any;
  data:Data;
  isData:boolean = false;
  constructor( 
                private _apuParts: ApuPiezaService,
                private actRoute: ActivatedRoute
             ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getApuPart();
  }

  getApuPart(){
    this._apuParts.getApuPart(this.id).subscribe((r:ApuPart) => {
      this.data = r.data;
      this.isData = true;
    })
  }

  donwloading = false;

  download() {
    this.donwloading = true;
    this._apuParts.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'apu_pieza_' + this.id + '.pdf';
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
