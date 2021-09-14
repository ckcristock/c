import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activos-fijos',
  templateUrl: './activos-fijos.component.html',
  styleUrls: ['./activos-fijos.component.scss']
})
export class ActivosFijosComponent implements OnInit {
  datos:any = [
    {
      document: '021560',
      name: 'Organizador',
      assetsType: 'Muebles y Enseres 1',
      cost_center: 'Administrativos',
      cost_pgca: '160.000',
      niif_cost: '160.000'
    },
    {
      document: '45454',
      name: 'Fabricación',
      assetsType: 'Equipos',
      cost_center: 'Administrativos',
      cost_pgca: '180.000',
      niif_cost: '180.000'
    }
  ]
  pagination:any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor() { }

  ngOnInit(): void {
  }

}
