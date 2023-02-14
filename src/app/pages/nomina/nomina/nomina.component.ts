import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PayrollFactorService } from '../../rrhh/novedades/payroll-factor.service';
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
  donwloadingExcNov: boolean = false;
  donwloadingExcCol: boolean = false;
  donwloadingPdfNom: boolean = false;
  pago: any = {};
  renderizar = false;
  funcionarios = [];
  funcionariosBase = [];
  people = [];

  inicioParemeter: ""
  finParemeter: ""

  listFuncionarios: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  constructor(
    private _payroll: PayRollService,
    private _people: PersonService,
    private _payrollFactor: PayrollFactorService,
    private _swal: SwalService,
    private route: ActivatedRoute,
    private router: Router
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
  mostrarFiltros() {
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
    this.collectionSize = this.funcionarios.length;
    this.refreshFuncionario();
  }

  refreshFuncionario() {
    this.listFuncionarios = this.funcionarios.map((func, i) => ({ id: i + 1, ...func })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
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

    console.log('no se puede borrar');

    this._payroll.deletePayroll().subscribe(r => {

    }, err => {

    })
  }

  showInterfaceForGlobo(modal) { }

  mostrarNovedades() {
    let params = {
      //date_start: moment("01-01-2020", ['DD-MM-YYYY']).format('YYYY-MM-DD'), //para pruebas y mostrar info
      date_start: moment(this.inicioPeriodo, ['DD/MM/YYYY']).format('YYYY-MM-DD'),
      date_end: moment(this.finPeriodo, ['DD/MM/YYYY']).format('YYYY-MM-DD')
    }

    this._payroll.downloadExcNov(params).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte_novedades';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      this.donwloadingExcNov = false;
    }),
      (error: any) => {
        console.log(error);
        console.log('Error downloading the file');
        this.donwloadingExcNov = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloadingExcNov = false;
      };
  }

  mostrarIngresosP(fun) { }

  mostrarIngresosNP(fun) { }

  mostrarDeducciones(fun) { }


  //Colillas de pago
  getColillasPago(datos: any) {
    let pet = 'gato'
    console.log(`[${datos.frecuencia_pago}]`);
    console.log([pet]);

    this.donwloadingPdfNom = true;
    this._payroll.dowloadPdfColillas(datos)
      .subscribe((res:BlobPart)=>{
        let blob = new Blob([res], {type: ' application/pdf'});
        let link = document.createElement("a");
        const filename = 'colillas-nomina'; //se podría poner período
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.donwloadingPdfNom = false;
      }),
      (err: any) =>{
        console.log('Error downloading the file');
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloadingPdfNom = false
      }

  }

  //Resumen de nómina
  getColilla(fun: any) {
    this.donwloadingExNom = true;
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

  //Pagar Nomina
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
          text: "Nómina guardada correctamente",
          icon: "success",
          timer: 1000,
          showCancel: false
        })
      this.router.navigateByUrl('/nomina/historial-pagos')
    }).catch((err: any) => {
      console.log(err);
    })

  }

}
