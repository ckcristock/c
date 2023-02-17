import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cesantia-current',
  templateUrl: './cesantia-current.component.html',
  styleUrls: ['./cesantia-current.component.scss']
})
export class CesantiaCurrentComponent implements OnInit {

  loading: boolean = false;
  empleados = {
    status: 'pendiente',
    empleados: [],
    person_payer: {
      first_name: '',
      second_name: '',
      first_surname: '',
      second_surname: '',
    }
  };
  employees: any[] = [];
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  habilitarPagar: boolean;

  constructor() { }

  ngOnInit(): void {
    this.habilitarBotonPagar();
  }

  //listo
  habilitarBotonPagar (){
    const hoy = new Date;
    const hoyMes = hoy.getMonth()
    // 0: Enero, 1: Febrere, 2: Marzo, 3: Abril,
    // 4: Mayo, 5: Junio, 6: Julio, 7: Agosto,
    // 8: Septiembre, 9: Octubre, 10: Noviembre, 11: Diciembre

    if (hoyMes == 0 || hoyMes == 1)  {
      this.habilitarPagar = true;
    } else {
      this.habilitarPagar = false;
    }
  }

  changePage($event) {

  }

  pagarCesantias(empleados:any) {

  }

  getReportPdfs(){

  }

  getOneReportPdfs(id:any, period:any) {

  }

}
