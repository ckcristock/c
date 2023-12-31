import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NegociosService } from '../negocios.service';

@Component({
  selector: 'app-table-negocios',
  templateUrl: './table-negocios.component.html',
  styleUrls: ['./table-negocios.component.scss']
})
export class TableNegociosComponent implements OnInit {

  @Input("negocios") negocios: any[]
  @Input("loading") loading: any
  @Input("paginationMaterial") paginationMaterial: any
  @Output() getNegocios = new EventEmitter<string>();
  @Output() handlePageEvent = new EventEmitter<string>();

  constructor(
    private _negocios: NegociosService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
  }


  changeState(event, neg) {
    this._swal.show({
      title: '¿Estas seguro(a)?',
      text: 'Vamos a cambiar la etapa del negocio',
      icon: 'question'
    }).then(r => {
      if (r.isConfirmed) {
        this._negocios.changeState({ status: event?.target?.value }, neg?.id).subscribe((res: any) => {
          if (res.status) {
            this._swal.show({
              icon: 'success',
              title: 'Operación exitosa',
              text: 'Etapa cambiada con éxito',
              showCancel: false,
              timer: 1000
            })
          } else {
            this._swal.hardError();
          }
        });
      }
    })
  }

  getNegociosParent($event) {
    this.getNegocios.emit($event)
  }
  handlePageEventParent($event) {
    this.handlePageEvent.emit($event)
  }

}
