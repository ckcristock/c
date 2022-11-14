import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { SedesService } from './sedes.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  filters: any = {
    name: '',
  }
  sedes: any[] = []
  loading: boolean;

  constructor(private _sedes: SedesService) { }

  ngOnInit(): void {
    this.getLocations();
  }

  getLocations(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filters
    }
    this.loading = true;
    this._sedes.paginateLocations(params).subscribe((res: any) => {
      this.sedes = res.data.data
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

}
