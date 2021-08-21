import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
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
  enterprises = [{
    name: 'VIDASER EU',
    initials: 'VIDASER EU',
    nit: '1'
  }, {
    name: 'MEDISERRRANO IPS S.A.S.',
    initials: 'MEDISERRRANO',
    nit: '900.941.895-7'
  }, {
    name: 'IPS MEDICINA ESPECIALIZADA DEL RIESGO EN SALUD DEL SUR S.A.S.',
    initials: 'MEGSALUD',
    nit: '	901.032.674-1'
  }, {
    name: 'SALUD VITAL IPS S.A.S.',
    initials: 'SALUDVITAL',
    nit: '901.034.231-1'
  
  }, {
    name: 'IPS HEMOPLIFE SALUD S.A.S.',
    initials: 'HEMOPLIFE',
    nit: '901.174.496-4'
  
  }, {
    name: 'ECONOMÍA Y MEDICINA A SU ALCANCE S.A.S.',
    initials: 'ECOMEDIS',
    nit: '901.184.011-9'
  }
]
  constructor() { }

  ngOnInit(): void {
  }



}
