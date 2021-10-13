import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerViaticosService } from './ver-viaticos.service';

@Component({
  selector: 'app-ver-viaticos',
  templateUrl: './ver-viaticos.component.html',
  styleUrls: ['./ver-viaticos.component.scss'],
})
export class VerViaticosComponent implements OnInit {
  data: any = {};
  id: string;
  constructor(
    private _viaticos: VerViaticosService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getViatico();
  }

  getViatico() {
    this._viaticos.getAllViaticos(this.id).subscribe((r: any) => {
      this.data = r.data;
    });
  }

  regresar() {
    this.location.back();
  }
  download() {
    this._viaticos.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'viatico_'+this.id+'.pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
     /*  this.loading = false; */
    }),
      (error) => {
        console.log('Error downloading the file');
       /*  this.loading = false; */
      },
      () => {
        console.info('File downloaded successfully');
       /*  this.loading = false; */
      };
  }
}
