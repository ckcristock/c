import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApuConjuntoService } from '../apu-conjunto.service';

@Component({
  selector: 'app-copiar-apu-conjunto',
  templateUrl: './copiar-apu-conjunto.component.html',
  styleUrls: ['./copiar-apu-conjunto.component.scss']
})
export class CopiarApuConjuntoComponent implements OnInit {
  id: string;
  data: any;

  constructor(
    private actRoute: ActivatedRoute,
    private _apuConjunto: ApuConjuntoService
  ) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getData();
  }

  getData() {
    this._apuConjunto.getApuSet(this.id).subscribe((r: any) => {
      this.data = r.data;
    })
  }

}
