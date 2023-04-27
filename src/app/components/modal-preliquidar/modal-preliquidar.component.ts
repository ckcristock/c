import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { DetalleService } from 'src/app/pages/ajustes/informacion-base/funcionarios/detalle-funcionario/detalle.service';


@Component({
  selector: 'app-modal-preliquidar',
  templateUrl: './modal-preliquidar.component.html',
  styleUrls: ['./modal-preliquidar.component.scss']
})
export class ModalPreliquidarComponent implements OnInit {
  @ViewChild('modalLiquidar') modalLiquidar;
  @Input('funcionario') funcionario;
  @Output('reload') send = new EventEmitter;
  form: FormGroup;
  datePipe = new DatePipe('es-CO');
  date = moment().format('YYYY-MM-DD');
  maxDate = moment().format('YYYY-MM-DD');
  responsable: any = {};

  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private _user: UserService,
    private detalleService: DetalleService,
  ) {
    this.responsable = this._user.user;
  }

  ngOnInit() {
  }

  openModal() {
    this._modal.open(this.modalLiquidar)
    this.createForm()
  }

  createForm() {
    this.form = this.fb.group({
      date_from: [this.date, Validators.required],
    })
  }

  selectedDate(fecha: any) {
    if (fecha.valor > moment()) {
      this._swal.show({
        icon: 'error',
        title: 'Fecha incorrecta',
        text: 'No puede escoger una fecha luego de hoy',
        showCancel: false,
        timer: 2000
      });
    } else {
      this.form.patchValue({
        date_from: this.datePipe.transform(fecha.value, 'yyyy-MM-dd')
      })
    }
  }

  liquidar(status: any) {
    let dataForm = {
      status,
    }
    let info = {
      id: this.funcionario.id,
      identifier: this.funcionario.identifier,
      full_name: this.funcionario.first_name + ' ' + this.funcionario.first_surname,
      contract_work: this.funcionario.work_contract_id ?? 0,
      liquidated_at: this.form.controls.date_from.value,
      reponsible: {
        person_id: this.responsable.id,
        usuario: this.responsable.usuario
      },
      status: status
    }
    let data = {
      state: 'Inactivo',
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'El funcionario ' + this.funcionario.first_name + ' no tendrá más acceso al sistema'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detalleService.setPreliquidadoLog(info).subscribe((r: any) => {
          if (r.status) {
            this.detalleService.blockUser(data, this.funcionario.id).subscribe((r: any) => {
            })
            this.detalleService.liquidar(dataForm, this.funcionario.id).subscribe((r: any) => {
              this._swal.show({
                icon: 'success',
                title: 'Proceso finalizado',
                text: r.data,
                showCancel: false,
                timer: 1000
              });
              this.send.emit()
              this._modal.close()
            });
          } else {
            this._swal.show({
              icon: 'error',
              title: 'Ha ocurrido un error inesperado',
              //text: 'El funcionario ha sido preliquidado con éxito.',
              //text: r.err.data,
              text: r.err.message,
              showCancel: false,
              timer: 2000
            });
          }
        })

      }
    });
  }

}
