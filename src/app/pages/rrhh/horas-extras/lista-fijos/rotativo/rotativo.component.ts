import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../../extra-hours.service';

@Component({
  selector: 'app-rotativo',
  templateUrl: './rotativo.component.html',
  styleUrls: ['./rotativo.component.scss'],
})
export class RotativoComponent implements OnInit {
  @Input('day') day;
  @Input('info') info;
  @Input('diario') diario;
  @Input('person') person;
  @Output('updateDates') updateDates = new EventEmitter<any>();

  funcionarioDato: any;
  diarioDato: any;
  horaInicioNoche = moment.utc('21:00:00', 'HH:mm:ss');
  horaFinNoche = moment.utc('06:00:00', 'HH:mm:ss');
  turnoDato: any = {};
  lista: any = {};

  extrasValidadas: any = {};
  validada = false;
  esVisible = false;

  constructor(private _swal: SwalService, private _extra: ExtraHoursService) {}

  ngOnInit(): void {
    
    this.funcionarioDato = this.diario;
    this.diarioDato = this.day;

    this.lista = {
      horasTrabajadas: this.day['tiempoLaborado'],
      horasExtrasDiurnas: this.day['HorasExtrasDiurnas'],
      horasExtrasNocturnas: this.day['HorasExtrasNocturnas'],
      horasExtrasDiurnasFestivasDom: this.day['HorasExtrasDiurnasDominicales'],
      horasExtrasNocturnasFestivasDom:
        this.day['HorasExtrasNocturnasDominicales'],
      recargosNocturnos: this.day['horasRecargoNocturna'],
      recargosFestivos:
        parseInt(this.day['horasRecargoDominicalNocturna']) +
        parseInt(this.day['horasRecargoDominicalDiurno']),
    };

    this.cargarExtrasValidadas(this.funcionarioDato.id);
    this.relacionarConHoraTurno();
    this.asignacionDatosReales();
  }

  guardarReporteDeExtras() {
    this._swal
      .show({
        title: '¿Está seguro(a)?',
        text: 'Va a realizar el guardado de validación de las horas extras del funcionario, asegúrese que todo coincida como debe ya que esto afectará cálculos de nómina.',
        icon: 'warning',
      })
      .then((res) => {
        if (res.isConfirmed) {
          
          let reporte = {
            person_id: this.funcionarioDato.id,
            date: this.diarioDato.date,
            ht: this.lista.horasTrabajadas,
            hed: this.lista.horasExtrasDiurnas,
            hen: this.lista.horasExtrasNocturnas,
            hedfd: this.lista.horasExtrasDiurnasFestivasDom,
            hedfn: this.lista.horasExtrasNocturnasFestivasDom,
            rn: this.lista.recargosNocturnos,
            rf: this.lista.recargosFestivos,
            hed_reales: this.lista.horasExtrasDiurnasReales,
            hen_reales: this.lista.horasExtrasNocturnasReales,
            hedfd_reales: this.lista.horasExtrasDiurnasFestivasDomReales,
            hedfn_reales: this.lista.horasExtrasNocturnasFestivasDomReales,
            rn_reales: this.lista.recargosNocturnosReales,
            rf_reales: this.lista.recargosFestivosReales,
          };
          if (this.validada === true) {
            //Actualizar
            this._extra
              .updateExtraHours(this.extrasValidadas.id, reporte)
              .subscribe(this.res);
          } else {
            this._extra.createExtraHours(reporte).subscribe(this.res);
          }
          //Actualizar datos en vista
        }
      });
  }

  res = (r: any) => {
    this._swal.show({
      title: 'Guardado con éxito',
      text: `La validación de horas extras para ${this.funcionarioDato.first_name} se generó con éxito`,
      icon: 'success',
      showCancel: false,
    });
    this.cargarExtrasValidadas(this.funcionarioDato.id);
  };
  mostrarModalDiarioFijo(diario) {}

  cargarExtrasValidadas(funcionario) {
    if (this.diarioDato['date'] != undefined) {
      this._extra
        .getExtraHoursValids(funcionario, this.diarioDato['date'])
        .subscribe((r: any) => {
          this.extrasValidadas = r.data;
          this.validada =
            this.extrasValidadas.date === this.diarioDato['date']
              ? true
              : false;
          if (this.validada) {
            this.lista.horasTrabajadas = this.extrasValidadas.ht;
            this.lista.horasExtrasDiurnas = this.extrasValidadas.hed;
            this.lista.horasExtrasNocturnas = this.extrasValidadas.hen;
            this.lista.horasExtrasDiurnasFestivasDom =
              this.extrasValidadas.hedfd;
            this.lista.horasExtrasNocturnasFestivasDom =
              this.extrasValidadas.hedfn;
            this.lista.recargosNocturnos = this.extrasValidadas.rn;
            this.lista.recargosFestivos = this.extrasValidadas.rf;
            this.lista.horasExtrasDiurnasReales =
              this.extrasValidadas.hed_reales;
            this.lista.horasExtrasNocturnasReales =
              this.extrasValidadas.hen_reales;
            this.lista.horasExtrasDiurnasFestivasDomReales =
              this.extrasValidadas.hedfd_reales;
            this.lista.horasExtrasNocturnasFestivasDomReales =
              this.extrasValidadas.hedfn_reales;
            this.lista.recargosNocturnosReales = this.extrasValidadas.rn_reales;
            this.lista.recargosFestivosReales = this.extrasValidadas.rf_reales;
          }
        });
    
    }
  }

  relacionarConHoraTurno() {
    this.turnoDato = this.diario.turnoOficial;
  }

  asignacionDatosReales() {
    this.lista.horasExtrasDiurnasReales = this.lista.horasExtrasDiurnas;
    this.lista.horasExtrasNocturnasReales = this.lista.horasExtrasNocturnas;
    this.lista.horasExtrasDiurnasFestivasDomReales =
      this.lista.horasExtrasDiurnasFestivasDom;
    this.lista.horasExtrasNocturnasFestivasDomReales =
      this.lista.horasExtrasNocturnasFestivasDom;
    this.lista.recargosFestivosReales = this.lista.recargosFestivos;
    this.lista.recargosNocturnosReales = this.lista.recargosNocturnos;
  }

  saved() {
    //this.calcularHorasTrabajadas();
    this.updateDates.emit();
  }


}
