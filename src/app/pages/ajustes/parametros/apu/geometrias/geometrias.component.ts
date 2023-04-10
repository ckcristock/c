import { Component, OnInit, ViewChild } from '@angular/core';
import { GeometriasService } from './geometrias.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-geometrias',
  templateUrl: './geometrias.component.html',
  styleUrls: ['./geometrias.component.scss']
})
export class GeometriasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  title: string = '';
  geometries: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 50,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
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

  constructor(
    private _geometrias: GeometriasService
  ) { }

  ngOnInit(): void {
    this.getGeometries();
  }

  openModal() {
    this.modal.show();
    this.title = 'Nueva Geometría'
  }

  getGeometries(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._geometrias.getGeometries(params).subscribe((r: any) => {
      this.geometries = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
