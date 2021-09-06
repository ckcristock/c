import { Component, OnInit } from '@angular/core';
import { SwalService } from '../../services/swal.service';
import { FixedTurnService } from './turno-fijo.service';

@Component({
  selector: 'app-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.scss'],
})
export class TurnoFijoComponent implements OnInit {
  turnosFijos = [];
  hours: any = [];
  loading = false;
  loadingHours = false;

  constructor(
    private _turnFixed: FixedTurnService,
    private _swal: SwalService
  ) {}

  ngOnInit(): void {
    this.getTunrs();
  }

  getTunrs() {
    this.loading = true;
    this._turnFixed.getFixedTurns().subscribe((r: any) => {
      this.turnosFijos = r.data;
      this.loading = false;
    });
  }

  findHours(fixed_turn_id, modal) {
    this.loadingHours = true;
    this._turnFixed.getFixedTurnHours({ fixed_turn_id }).subscribe((r: any) => {
      this.hours = r.data;
      this.loadingHours = false;
    });
  }

  editTurn(id) {}
  changeState(id) {
    this._swal
      .show({
        icon: 'warning',
        title: '¿Está seguro(a)?',
        text: 'Asegúrese de haber movido los funcionarios a otro turno, si existen en el turno actual será modificado',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._turnFixed.changeState(id).subscribe((r: any) => {
            let icon = 'success';
            let text = 'Turno actualizado correctamente';
            let title = 'Operación exitosa';
            if (r.code != 200) {
              icon = 'error';
              text = 'Comuníquese con el Dpt. de sistemas';
              title = 'Ha ocurrido un error';
            }
	    this.getTunrs();
            this._swal.show({ title, text, icon, showCancel: false });
          });
        }
      });
  }
}
