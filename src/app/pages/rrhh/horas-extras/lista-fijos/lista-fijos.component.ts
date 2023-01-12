import { Component, Input, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
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

  constructor(
    private _extraHour: ExtraHoursService,
    private _swal: SwalService,
    ) {}

  personData: any;
  loading: boolean = false;
  ngOnInit(): void {

    this.getData();
  }
  dayswork: any[] = []
  getData() {
    this.loading = true;
    let data = {
      id: this.person.id,
      tipo: this.person.turn_type,
      pd: this.primerDia,
      ud: this.ultimodiaDia,
    };
    this._extraHour.getDetailPeople(data).subscribe((r: any) => {
      this.personData = r.data
      this.dayswork = this.personData.days_work
      this.loading = false;
    });
  }

  validarExtras = () => {
    this._swal.show({
      title: 'En Proceso',
      text: 'Estaré trabajando en ello',
      icon: 'warning',
      showCancel: false,
    });
    console.log("valida toooodas las horas extras");
  }
}
