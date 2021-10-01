import { Component, Input, OnInit } from '@angular/core';
import { ExtraHoursService } from '../extra-hours.service';

@Component({
  selector: 'app-lista-fijos',
  templateUrl: './lista-fijos.component.html',
  styleUrls: ['./lista-fijos.component.scss'],
})
export class ListaFijosComponent implements OnInit {
  @Input('person') person;
  @Input('turnType') turnType;
  @Input('primerDia') primerDia;
  @Input('ultimodiaDia') ultimodiaDia;
  constructor(private _extraHour: ExtraHoursService) {}
  personData: any;
  ngOnInit(): void {
      
    this.getData();
  }

  getData() {
    
    let data = {
      id: this.person.id,
      tipo: this.person.turn_type,
      pd: this.primerDia,
      ud: this.ultimodiaDia,
    };
    this._extraHour.getDetailPeople(data).subscribe((r: any) => {
      this.personData = r.data;
    });

    
  }
}
