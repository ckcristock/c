import { Component, OnInit } from '@angular/core';

import { personsList } from './data';
import { PersonService } from '../persons/person.service'
import { Person } from 'src/app/core/models/person.model';


@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.scss']
})

export class FuncionariosComponent implements OnInit {
  pagination = {
    pageSize: 12,
    page: 1,
    collectionSize: 0,
  }
  loading = false;
  breadCrumbItems: Array<{}>;
  people: Array<Person>;

  public dependencies: any = [
    {
      id: 1,
      name: 'Talento Humano'
    },
    {
      id: 2,
      name: 'Contabilidad'
    },
    {
      id: 3,
      name: 'Facturacion'
    },
    {
      id: 4,
      name: 'Calidad'
    },
    {
      id: 5,
      name: 'Centro Contacto'
    },
    {
      id: 6,
      name: 'Tecnología'
    }
  ]

  public companies: any = [
    {
      id: 1,
      name: "HEMOPLIFE SALUD"
    },
    {
      id: 2,
      name: "MEGSALUD IPS"
    },
    {
      id: 3,
      name: "ECOMEDIS"
    },
    {
      id: 4,
      name: "VIDASER"
    },
    {
      id: 5,
      name: "MEDISERRANO"
    },
    {
      id: 6,
      name: "SALUD VITAL"
    },
    {
      id: 7,
      name: "MASCORP"
    },
    {
      id: 2,
      name: "INGBUS"
    },
    {
      id: 2,
      name: "INNOVATING"
    }
  ]
  isCollapsed: boolean;
  collapsed: boolean;
  collapsed3: boolean;

  constructor(private _person: PersonService) {
    this.getPeople();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Product', active: true }];
    this.isCollapsed = false;
    this.collapsed = false;
    this.collapsed3 = false;

  }


  getPeople(page = 1, name = '') {
    
    this.pagination.page = page;
    let params:any = {...this.pagination}
    console.log(params);
    params.name = name ? name : ''
    this.loading = true;
    
    this._person.getPeople(params)
      .subscribe(d => {
        this.loading = false;
        this.people = d['data']['data']
        this.pagination.collectionSize = d['data']['total']
      })
  }


}
