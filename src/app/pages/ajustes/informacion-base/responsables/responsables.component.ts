import { Component, OnInit } from '@angular/core';
import { ResponsablesService } from './responsables.service';
import { PersonService } from '../persons/person.service';
import { SwalService } from '../services/swal.service';

@Component({
  selector: 'app-responsables',
  templateUrl: './responsables.component.html',
  styleUrls: ['./responsables.component.scss']
})
export class ResponsablesComponent implements OnInit {

  responsibles: any[] = [];
  people: any[] = [];

  constructor(
    private _responsibles: ResponsablesService,
    private _people: PersonService,
    private _swal: SwalService
  ) { }

  ngOnInit() {
    this.getResponsiles();
    this.getPeople();
  }

  getResponsiles() {
    this._responsibles.getResponsibles().subscribe((res: any) => {
      this.responsibles = res.data;
    })
  }

  getPeople() {
    this._people.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'SELECCIONE', value: '', disabled: true })

    })
  }

  changeResponsible(person_id, id) {
    if (person_id) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a cambiar el funcionario responsable.'
      }).then(r => {
        if (r.isConfirmed) {
          let data = {
            person_id: person_id
          }
          this._responsibles.changeResponsible(data, id).subscribe((res: any) => {
            if (res.status) {
              this._swal.show({
                icon: 'success',
                title: 'Funcionario asignado correctamente.',
                text: '',
                showCancel: false,
                timer: 1000
              })
            }
          },
            (error) => {
              this._swal.hardError()
            });
        }
      })
    }
  }

}
