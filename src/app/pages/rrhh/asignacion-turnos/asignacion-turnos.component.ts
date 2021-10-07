import { Component, OnInit, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AsignacionTurnosService } from './asignacion-turnos.service';
import { RotatingTurnService } from '../../ajustes/informacion-base/turnos/turno-rotativo/rotating-turn.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-asignacion-turnos',
  templateUrl: './asignacion-turnos.component.html',
  styleUrls: ['./asignacion-turnos.component.scss'],
})
export class AsignacionTurnosComponent implements OnInit {
  datosGenerales: any[] = [];
  loading = false;
  turns: any[] = [];
  groupList: any[];
  dependencyList: any[] = [];
  diaInicialSemana = moment().startOf('week');
  diaFinalSemana = moment().endOf('week');
  forma: FormGroup;
  changeWeek = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private _asignacion: AsignacionTurnosService,
    private _rotatingTurn: RotatingTurnService,
    private _groups: GroupService,
    private _dependencies: DependenciesService
  ) {}

  ngOnInit(): void {
    this.getTurns();
    this.createForm();
    this.getData();
    this.getGrpups();
    this.addElement();
  }
  getGrpups() {
    this._groups.getGroup().subscribe((r: any) => {
      this.groupList = r.data;
      this.groupList.unshift({ value: 0, text: 'Todos' });
    });
  }
  getDependencies(group_id) {
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencyList = r.data;
      this.addElement();
    });
  }

  getTurns() {
    this._rotatingTurn.getAll().subscribe((r: any) => {
      this.turns = r.data;
    });
  }

  createForm() {
    this.forma = this.fb.group({
      week: [moment().format(moment.HTML5_FMT.WEEK)],
      group_id: [0],
      dependency_id: [0],
      person: [''],
      /* company_id: [0], */
    });

    this.forma.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.forma.get('dependency_id').enable();
        this.getDependencies(valor);
      } else {
        this.addElement();
        this.forma.patchValue({ dependency_id: 0 });
        this.forma.get('dependency_id').disable();
      }
    });
  }

  filtrar() {}
  makeRequestBySemana() {
    let semana = this.forma.get('week').value;
    /* this.numeroSemana = moment(semana).week(); */
    this.diaInicialSemana = moment(semana).startOf('week');
    this.diaFinalSemana = moment(semana).endOf('week');
    //  this.changeWeek.emit({diaInicialSemana:this.diaInicialSemana,
    //	diaFinalSemana:this.diaFinalSemana});
  }

  descargarInformeTurnos(turno) {}

  getData() {
    this.loading = true;
    this._asignacion
      .getPeople(this.diaInicialSemana, this.forma.value)
      .subscribe((r: any) => {
        this.datosGenerales = r.data;
        this.loading = false;
        setTimeout(() => {
          this.changeWeek.emit({
            diaInicialSemana: this.diaInicialSemana,
            diaFinalSemana: this.diaFinalSemana,
          });
          // this.changeWeek.emit();
        }, 200);
      });
  }
  addElement() {
    this.dependencyList.unshift({ value: 0, text: 'Todas' });
  }
}
