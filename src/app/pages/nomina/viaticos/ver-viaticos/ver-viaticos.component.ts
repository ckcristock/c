import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerViaticosService } from './ver-viaticos.service';
import { Subscription } from 'rxjs';
import { LegalizarDataService } from '../legalizar/legalizar-data.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-ver-viaticos',
  templateUrl: './ver-viaticos.component.html',
  styleUrls: ['./ver-viaticos.component.scss'],
})
export class VerViaticosComponent implements OnInit {
  data: any;
  id: string;
  loading: boolean;
  viaticos$: Subscription;
  constructor(
    private _viaticos: VerViaticosService,
    private location: Location,
    private route: ActivatedRoute,
    private _viaticosData: LegalizarDataService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r) => {
      if (r) {
        this.data = r;
      }
    });

    this.getViatico();
  }

  getViatico() {
    this.loading = true;
    this._viaticos.getAllViaticos(this.id).subscribe((r: any) => {
      this._viaticosData.viaticos.next(r.data);
      this.loading = false;
    });
  }
  regresar() {
    this.location.back();
  }
  download() {
    this._viaticos.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'viatico_' + this.id + '.pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      /*  this.loading = false; */
    },
      (error) => {
        /*  this.loading = false; */
        this._swal.hardError();
      },
      () => {
        /*  this.loading = false; */
      });
  }

  ngOnDestroy(): void {
    if (this.viaticos$) {
      this.viaticos$.unsubscribe();
    }
  }
}
