import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-certificados-list',
  templateUrl: './certificados-list.component.html',
  styleUrls: ['./certificados-list.component.scss']
})
export class CertificadosListComponent implements OnInit {
data = [
    {
      icon: 'fa fa-user',
      created_at: '2021-01-011',
      description: 'Desc',
      img: '',
      first_name: 'Carlos ',
      first_surname: 'Cardona ',
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
