import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GeometriasService } from '../geometrias.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ver-geometria',
  templateUrl: './ver-geometria.component.html',
  styleUrls: ['./ver-geometria.component.scss']
})
export class VerGeometriaComponent implements OnInit {
  id: any;
  geometry: any = {};
  loading: boolean;
  constructor(
    private _geometria: GeometriasService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getGeometry();
  }

  getGeometry() {
    this.loading = true;
    this._geometria.getGeometry(this.id).subscribe((r: any) => {
      this.geometry = r.data;
      this.loading = false;
    })
  }

}
