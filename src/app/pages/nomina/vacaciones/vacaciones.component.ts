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
  donwloading: boolean = false;
  days: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro: any = {
    person: '',
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
  private getDismissReason(reason: any) {

  }

  openModal() {
    this.modal.show();
  }

  vacationData(vacation) {
    this.vacation = { ...vacation };
    console.log(this.vacation)
    this.calcularDias(); // La función se llama justo aca para que calcule los dias antes de hacer la operación.
    this.valor = this.vacation.person.contractultimate.salary * this.daysDiference / 30;
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
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._vacations.paginateVacations(params).subscribe((r: any) => {
      this.vacations = r.data.data;
      this.pagination.collectionSize = r.data.total;
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
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Vamos a registrar el pago de estas vacaciones',
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this._vacations.saveInformation(data).subscribe((r: any) => {
          this.modalService.dismissAll();
          this.getVacations();
          this._swal.show({
            title: 'Vacaciones pagadas',
            text: '',
            icon: 'success',
            showCancel: false,
            timer: 1000
          })
        })
      }
    })
  }

  download(vacation) {
    this.donwloading = true
    this._vacations.download(vacation.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'colilla_pago';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloading = false
    },
      (err: any) => {
        console.log(err);
        this._swal.show(
          {
            title: 'Error',
            text: "Ha ocurrido un error descargando este archivo",
            icon: "error",
            showCancel: false
          })
        this.donwloading = false
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloading = false
      }
    )
  }

}
