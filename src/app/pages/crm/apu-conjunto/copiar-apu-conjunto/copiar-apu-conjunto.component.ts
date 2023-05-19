import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuConjuntoService } from '../apu-conjunto.service';
import { ApuConjunto } from 'src/app/core/interfaces/apu-conjunto/apu-conjunto';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
export interface ApuSetResponse {
  data: ApuConjunto;
}

@Component({
  selector: 'app-copiar-apu-conjunto',
  templateUrl: './copiar-apu-conjunto.component.html',
  styleUrls: ['./copiar-apu-conjunto.component.scss']
})
export class CopiarApuConjuntoComponent implements OnInit {
  id: number;
  data!: ApuConjunto;
  loading: boolean;

  constructor(
    private actRoute: ActivatedRoute,
    private _apuConjunto: ApuConjuntoService,
    private _swal: SwalService
  ) {
    this.loading = true;
    this.id = this.actRoute?.snapshot?.params?.['id'];
  }

  ngOnInit(): void {
    this.getData();
  }

  async getData() {
    try {
      const r: ApuSetResponse = await this._apuConjunto?.getApuSet(this.id)?.toPromise();
      this.data = r?.data;
      this.loading = false
    } catch (error) {
      console.error('Error fetching data:', error);
      this._swal.error();
    }
  }

}

