import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regimenes-niveles',
  templateUrl: './regimenes-niveles.component.html',
  styleUrls: ['./regimenes-niveles.component.scss']
})
export class RegimenesNivelesComponent implements OnInit {

  pagination = {
    pageSize: 20,
    page: 1,
    collectionSize: 40,

  }
  filters: any = {

    date: '',
    institution: '',
    patient: '',
    speciality: '',

  }
  searching = false;
  searchFailed = false;
  regimes = [{
    code: 'CO',
    name: 'Contributivo',

  }, {
    code: 'COD1',
    name: 'Subsidiado',

  }
  ];
  levels = [{
    code: 'CO',
    name: 'Contributivo',

  }, {
    code: 'COD1',
    name: 'Subsidiado',

  }, {
    code: 'CO',
    name: '	901.032.674-1',
  }
  ];


  constructor() { }

  ngOnInit(): void {
  }

}
