import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { ExtraHoursService } from '../../extra-hours.service';

@Component({
  selector: 'app-fijo',
  templateUrl: './fijo.component.html',
  styleUrls: ['./fijo.component.scss'],
})
export class FijoComponent implements OnInit {
  @Input('day') day;
  @Input('info') info;
  @Input('diario') diario;
  @Input('person') person;
  @Output('updateDates') updateDates = new EventEmitter<any>();

  funcionarioDato: any;
  diarioDato: any;
  /* horaInicioNoche = moment.utc('21:00:00', 'HH:mm:ss');
  horaFinNoche = moment.utc('06:00:00', 'HH:mm:ss'); */
  turnoDato: any = {};
  lista: any = {};

  extrasValidadas: any = {};
  validada = false;
  esVisible = false;

  constructor(private _swal: SwalService, private _extra: ExtraHoursService) {}

  ngOnInit(): void {
//console.log(this.diario);
    this.funcionarioDato = this.person;
    this.cargarExtrasValidadas(this.funcionarioDato.id);
    this.relacionarConHoraTurno();
    this.asignacionDatosReales();
    this.diarioDato = this.diario;

    this.lista = {
      horasTrabajadas: this.day['tiempoLaborado'],
      horasExtrasDiurnas: this.day['HorasExtrasDiurnas'],
      horasExtrasNocturnas: this.day['HorasExtrasNocturnas'],
      horasExtrasDiurnasFestivasDom: this.day['HorasExtrasDiurnasDominicales'],
      horasExtrasNocturnasFestivasDom:
        this.day['HorasExtrasNocturnasDominicales'],
      recargosNocturnos: this.day['horasRecargoNocturna'],
      recargosDiurnosFestivos:this.day['horasRecargoDominicalDiurno'],
      recargosNocturnosFestivos: this.day['horasRecargoDominicalNocturna'],
    };


  }
  get hasDay() {
    return this.diario['0']?.day;
  }
  guardarReporteDeExtras() {
    this._swal
      .show({
        title: '¿Estás seguro(a)?',
        text: 'Vas a realizar la validación de las horas extras del funcionario, confirma que todo coincida correctamente pues esto afectará los cálculos de nómina.',
        icon: 'warning',
      })
      .then((res) => {
        if (res.isConfirmed) {
          let reporte = {
            person_id: this.funcionarioDato.id,
            date: this.diario['0']?.day.date,
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
          /* let reporte = {
            person_id: this.funcionarioDato.id,
            date: '2022-09-09',
            ht: 2,
            hed: 2,
            hen: 2,
            hedfd: 2,
            hedfn: 2,
            rn: 2,
            rf: 2,
            hed_reales: 2,
            hen_reales: 2,
            hedfd_reales: 2,
            hedfn_reales: 2,
            rn_reales: 2,
            rf_reales: 2,
          }; */
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
    if (this.hasDay) {
      this._extra
        .getExtraHoursValids(funcionario, this.diario['0']?.day.date)
        .subscribe((r: any) => {
          this.extrasValidadas = r.data;
          console.log(this.extrasValidadas)
          if (this.extrasValidadas) {
            if (
              this.hasDay &&
              this.extrasValidadas.date === this.diario['0']?.day.date
            ) {
              this.validada = true;
            }
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
              this.lista.recargosNocturnosReales =
                this.extrasValidadas.rn_reales;
              this.lista.recargosFestivosReales =
                this.extrasValidadas.rf_reales;
            }
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
