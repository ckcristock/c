import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { PayRollService } from './pay-roll.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {
  nomina: any = {
    frecuencia_pago: 30,
  };
  loadingPeople = false;
  pago: any = {};
  renderizar = false;
  funcionarios = [];
  funcionariosBase = [];
  people = [];

  constructor(
    private _payroll: PayRollService,
    private _people: PersonService,
    public config: NgbDropdownConfig
  ) {
    config.placement = 'left';
    config.placement = 'left-bottom';
  }

  ngOnInit(): void {
    this.getPagoNomina();
    this.getPeople();
  }

  getPagoNomina() {
    console.log('getting...');
    
    this.loadingPeople = true;
    this._payroll.getPayrollPays().subscribe((r: any) => {
      this.nomina = r.data;
      this.pago.id = this.nomina.nomina_paga_id
        ? this.nomina.nomina_paga_id
        : '';

      this.getFuncionarios(r.data.funcionarios);
      this.getUsuario();
      this.loadingPeople = false;
    });
  }
  getUsuario() {
    this.pago.admin_id = 1;
  }

  getFuncionarios(data) {
    this.funcionarios = data;
    this.funcionariosBase = data;
    this.renderizar = true;
  }

  filter(event) {
    console.log(event);
    
    if(event){
      let fun= this.funcionariosBase.find(r=> r.id==event )
      console.log(fun);
      
      this.funcionarios = fun ? [fun] : []

    }else{
      this.funcionarios = this.funcionariosBase
    }
    console.log(event);
    console.log(this.funcionarios);
  
  }

  getPeople() {
    this._people.getAll({}).subscribe((res: any) => {
      this.people = res.data;
      this.people.unshift({ text: 'Todos', value: '' });
    });
  }

  get inicioPeriodo() {
    return this.nomina.inicio_periodo
      ? moment(this.nomina.inicio_periodo).format('DD/MM/YYYY')
      : '';
  }
  get finPeriodo() {
    return this.nomina.fin_periodo
      ? moment(this.nomina.fin_periodo).format('DD/MM/YYYY')
      : '';
  }
  cargarDatosFuncionarios(fechaInicio, fechaFin) {
    this._payroll.getPeoplePayroll().subscribe((r: any) => {
      this.nomina = r.data;
    });
  }

  deletePagoNomina() {}

  showInterfaceForGlobo(modal) {}

  mostrarNovedades(fun) {}
  mostrarIngresosP(fun) {}
  mostrarIngresosNP(fun) {}
  mostrarDeducciones(fun) {}
  getColilla(fun) {}
}
