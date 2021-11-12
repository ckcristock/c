import { Component, OnInit } from '@angular/core';
import { PayrollPersonService } from './payroll-person.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-nomina-funcionario',
  templateUrl: './nomina-funcionario.component.html',
  styleUrls: ['./nomina-funcionario.component.scss'],
})
export class NominaFuncionarioComponent implements OnInit {
  tabs = ["Colilla Pago", "Seguridad y Parafiscales", "Provisiones"]
  tabActual = 'Colilla Pago';
  funcionario: any = {};
  datosEmpresa: any = {};
  pid = '';
  inicio = '';
  fin = '';
  show = false;

  constructor(
    private _payPerson: PayrollPersonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pid = this.route.snapshot.params.pid;
    this.inicio = this.route.snapshot.params.fin;
    this.fin = this.route.snapshot.params.inicio;
    this.getUsuario();
    this.cargarDatosEmpresa();
  }

  getUsuario() {
    this._payPerson.getPersonPay({ pid: this.pid }).subscribe((r: any) => {
      this.funcionario = r;
    });
  }
  async cargarDatosEmpresa() {
    await this._payPerson
      .getCompanyGlobal()
      .toPromise()
      .then((r: any) => {
        this.datosEmpresa = r;
        this.show = true;
      });
  }
  get inicioFormato() {
    return moment(this.inicio).format('DD/MM/YYYY');
  }
  get finFormato() {
    return moment(this.fin).format('DD/MM/YYYY');
  }
}
