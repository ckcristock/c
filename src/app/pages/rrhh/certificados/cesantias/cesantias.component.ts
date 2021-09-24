import { Component, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss'],
})
export class CesantiasComponent implements OnInit {
  cesantias = [
    {
      id: 1,
      icon: 'fa fa-user',
      created_at: '2021-01-011',
      description: 'Desc',
      img: '',
      first_name: 'Carlos ',
      first_surname: 'Cardona ',
      state: 'Pendiente',
    },
    {
      id: 2,
      icon: 'fa fa-user',
      created_at: '2021-01-011',
      description: 'Desc',
      img: '',
      first_name: 'Carlos ',
      first_surname: 'Cardona ',
      state: 'Aprobada',
    },
  ];
  constructor(private _swal: SwalService) {}

  ngOnInit(): void {}

  setState( { id }, state) {
    this._swal.show({
      text: 'Se dispone a cambiar el estado',
      title: '¿Está seguro?',
      icon: 'warning',
    }).then(r=>{
      if(r.isConfirmed){
      }
    });
  }
}
