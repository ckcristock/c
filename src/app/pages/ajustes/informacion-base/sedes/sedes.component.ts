import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  pagination = {
    pageSize: 20,
    page: 1,
    collectionSize: 20,

  }
  filters: any = {

    date: '',
    institution: '',
    patient: '',
    speciality: '',

  }
  sedes = [{
    enterprise: 'Genric',
    code: '001',
    name: 'MAQMO',
    nit: '1'
  }
  ]
  constructor() { }

  ngOnInit(): void {
  }


}
