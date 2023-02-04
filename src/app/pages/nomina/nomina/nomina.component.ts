import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
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
  donwloadingExNom: boolean = false;
  pago: any = {};
  renderizar = false;
  funcionarios = [];
  funcionariosBase = [];
  people = [];

  inicioParemeter: ""
  finParemeter: ""
  constructor(
    private _payroll: PayRollService,
    private _people: PersonService,
    private _swal: SwalService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    if (Object.keys(params).length) {
      this.inicioParemeter = params.inicio;
      this.finParemeter = params.fin;
    }
    this.getPagoNomina();
    this.getPeople();
  }
  estadoFiltros = false;
  mostrarFiltros(){
    this.estadoFiltros = !this.estadoFiltros
  }

  getPagoNomina() {
    this.loadingPeople = true;
    const params = this.inicioParemeter && this.finParemeter ?
      {
        date1: this.inicioParemeter, date2: this.finParemeter,
      } : {}

    this._payroll.getPayrollPays(params).subscribe((r: any) => {
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
    if (event) {
      let fun = this.funcionariosBase.find(r => r.id == event)
      this.funcionarios = fun ? [fun] : []

    } else {
      this.funcionarios = this.funcionariosBase
    }
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

  deletePagoNomina() {
    this._payroll.deletePayroll().subscribe(r => {

    }, err => {

    })
  }

  showInterfaceForGlobo(modal) { }

  mostrarNovedades(fun) { }

  mostrarIngresosP(fun) { }

  mostrarIngresosNP(fun) { }

  mostrarDeducciones(fun) { }




  getColillasPago(datos: any){
    let mono = 'sapo'
    console.log(`[${datos.frecuencia_pago}]`);
    console.log([mono]);
  }

  getColilla(fun:any) {
    this.donwloadingExNom = true;
    //console.log(fun);
    this._payroll.downloadExNomina(fun)
    .subscribe((res: BlobPart) => {
        let blob = new Blob([res], { type: 'application/excel' });
        let link = document.createElement("a");
        const filename = 'reporte-nomina';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
      }), (err: any) => {
          console.log(err);
          console.log('Error downloading the file');
      }, () => console.info('File downloaded successfully');
    this.donwloadingExNom = false;
  }

  postPagoNomina() {
    this.pago.start_period = this.nomina.inicio_periodo;
    this.pago.end_period = this.nomina.fin_periodo;
    this.pago.total_salaries = this.nomina.salarios;
    this.pago.total_retentions = this.nomina.retenciones;
    this.pago.total_provisions = this.nomina.provisiones;
    this.pago.total_social_secturity = this.nomina.seguridad_social;
    this.pago.total_parafiscals = this.nomina.parafiscales;
    this.pago.total_overtimes_surcharges = this.nomina.extras;
    this.pago.total_incomes = this.nomina.ingresos;
    this.pago.total_cost = this.nomina.costo_total_empresa;

    this._swal
      .show({
        title: "¿Está seguro?",
        text:
          "Se dispone a generar una nómina, revise que todo coincida antes de continuar.",
        icon: "warning",

      }, this.savePayroll)
      .then(result => {
        if (result.isConfirmed) {
          this.getPagoNomina();
          this.renderizar = false;
        }
      });
  }

  savePayroll = async () => {
    await this._payroll.savePayroll(this.pago).toPromise().then((r: any) => {
      this._swal
        .show({
          title: "Operación exitosa",
          text: "Nómina Guardada correctamente",
          icon: "success"
        })
    }).catch((err: any) => {
      console.log(err);
    })

  }

}
