import { Component, OnInit } from '@angular/core';
import { ApuPiezaService } from './apu-pieza.service';

@Component({
  selector: 'app-apu-pieza',
  templateUrl: './apu-pieza.component.html',
  styleUrls: ['./apu-pieza.component.scss']
})
export class ApuPiezaComponent implements OnInit {
  apuParts:any[] = [];
  loading:boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    creation_date: ''
  }
  constructor(
                private _apuParts: ApuPiezaService
              ) { }

  ngOnInit(): void {
    this.getApuParts();
  }

  getApuParts(page = 1){
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._apuParts.apuPartPaginate(params).subscribe((r:any) => {
      this.apuParts = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
