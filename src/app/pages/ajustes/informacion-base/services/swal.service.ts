import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  public SwalObj: any = {
    type: 'warning',
    title: 'Alerta',
    msg: '',
    html: ''
  };
  public buttonColor = {
    confirm: '#A3BD30',
    cancel:'#d33'
  }

  constructor() { }

  public ShowMessage(data: any) {
    this.SetSwalData(data);
  }

  private SetSwalData(data: any) {
    if (typeof (data) == 'object') {
      if (Array.isArray(data)) {
        let i = 0;
        for (const key in this.SwalObj) {
          this.SwalObj[key] = data[i];
          i++;
        }
      } else {
        this.SwalObj.type = data.codigo;
        this.SwalObj.title = data.titulo;
        this.SwalObj.msg = data.mensaje;
        this.SwalObj.html = data.html;
      }
    }
  }
  show({ title, text, icon, timer = 0, showCancel = true,

  }, preConfirm?) {
    let swal: any = {
      title,
      text,
      icon,
      timer,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showCancelButton: showCancel,
      confirmButtonColor: this.buttonColor.confirm,
      confirmButtonText: showCancel ? '¡Sí, confirmar!' : 'OK',
      cancelButtonColor: this.buttonColor.cancel,
      cancelButtonText: 'Cancelar',
      reverseButtons: true

    };
    if (preConfirm) {
      swal = {
        ...swal,
        preConfirm,
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true
      }
    }
    return Swal.fire(swal)
  }

}
