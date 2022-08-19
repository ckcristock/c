import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import {SwalService} from '../../services/swal.service';
import { RotatingTurnService } from './rotating-turn.service';
@Component({
  selector: 'app-turno-rotativo',
  templateUrl: './turno-rotativo.component.html',
  styleUrls: ['./turno-rotativo.component.scss'],
})
export class TurnoRotativoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  showModal = new EventEmitter<any>();
  loading = false;
  turnosRotativo: any = [];
  constructor(private _rotatingT: RotatingTurnService,
      private _swal: SwalService
	     ) {}

  ngOnInit(): void {
    this.getAll();
  }

  create( id = 0 ) {
    this.showModal.emit( id );
  }
  getAll() {
    this.loading = true;
    this._rotatingT.getAll().subscribe((r: any) => {
      this.loading = false;
      this.turnosRotativo = r.data;
      console.warn(this.turnosRotativo)
    });
  }
  changeState(id) {
    this._swal
      .show({
        icon: 'warning',
        title: '¿Está seguro(a)?',
        text: 'Asegúrese de haber movido los funcionarios a otro turno, si existen en el turno actual será modificado',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this._rotatingT.changeState(id).subscribe((r: any) => {
            let icon = 'success';
            let text = 'Turno actualizado correctamente';
            let title = 'Operación exitosa';
            if (r.code != 200) {
              icon = 'error';
              text = 'Comuníquese con el Dpt. de sistemas';
              title = 'Ha ocurrido un error';
            }
            this.getAll();
            this._swal.show({ title, text, icon, showCancel: false,timer: 1000 });
          });
        }
      });
  }
}
