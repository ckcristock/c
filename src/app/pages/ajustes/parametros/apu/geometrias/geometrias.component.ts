import { Component, OnInit, ViewChild } from '@angular/core';
import { GeometriasService } from './geometrias.service';

@Component({
  selector: 'app-geometrias',
  templateUrl: './geometrias.component.html',
  styleUrls: ['./geometrias.component.scss']
})
export class GeometriasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  title: string = '';
  geometries: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
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
    this.loading = true;
    this._geometrias.getGeometries(this.pagination).subscribe((r: any) => {
      this.geometries = r.data.data;
      console.log(this.geometries)
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

}
