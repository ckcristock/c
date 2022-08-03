import { Component, OnInit, ViewChild } from '@angular/core';
import { VacacionesService } from './vacaciones.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import * as moment from 'moment';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vacaciones',
  templateUrl: './vacaciones.component.html',
  styleUrls: ['./vacaciones.component.scss']
})
export class VacacionesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  vacations: any[] = [];
  vacation: any = {};
  valor: any;
  daysDiference: any;
  days: any;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor(
    private _vacations: VacacionesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getVacations();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModal() {
    this.modal.show();
  }

  vacationData(vacation) {
    this.vacation = { ...vacation };
    this.calcularDias(); // La función se llama justo aca para que calcule los dias antes de hacer la operación.
    this.valor = this.vacation.salary * this.daysDiference / 30;
  }

  calcularDias() {
    let date_start = new Date(this.vacation.date_start); // Fecha inicial
    let date_end = new Date(this.vacation.date_end); // Fecha final
    let timeDiff = Math.abs(date_start.getTime() - date_end.getTime());
    this.daysDiference = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Días entre las dos fechas
    let sundays = 0; //Número Domingos
    let array = new Array(this.daysDiference);
    for (let i = 0; i < this.daysDiference; i++) {
      if (date_start.getDay() == 0) {
        sundays++;
      }
      date_start.setDate(date_start.getDate() + 1);
    }
    this.days = this.daysDiference - sundays; // Dias de Vacaciones sin contar los domingos.
    return sundays;
  }

  getVacations(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._vacations.getVacations().subscribe((r: any) => {
      this.vacations = r.data.data;
      this.pagination.collectionSize = r.total;
      this.loading = false;
    });
  }


  saveInformation(state) {
    let value = this.valor;
    let payroll_factor_id = this.vacation.id;
    let days = this.days;
    let data = {
      value,
      state,
      payroll_factor_id,
      days
    }
    this._vacations.saveInformation(data).subscribe((r: any) => {
      //this.modal.hide();
      this.modalService.dismissAll(); 
      this.getVacations();
      this._swal.show({
        icon: 'success',
        title: 'Vacación Pagada',
        text: '',
        showCancel: false
      });
    })
  }

}
