import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../services/swal.service';
import { FixedTurnService } from './turno-fijo.service';

@Component({
  selector: 'app-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.scss'],
})
export class TurnoFijoComponent implements OnInit {
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
  turnosFijos = [];
  hours: any = [];
  loading = false;
  loadingHours = false;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }

  constructor(
    private _turnFixed: FixedTurnService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getTurns();
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    
  }

  getTurns(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._turnFixed.getFixedTurns(params).subscribe((r: any) => {
      this.turnosFijos = r.data.data;
      this.pagination.collectionSize = r.data.total;
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

  editTurn(id) { }
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
            this.getTurns();
            this._swal.show({ title, text, icon, showCancel: false, timer: 1000 });
          });
        }
      });
  }
}
