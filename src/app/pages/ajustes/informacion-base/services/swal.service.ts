import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  constructor() { }

  show({ title, text, icon, timer = 0, showCancel = true,

  },  preConfirm ?  ) {
    let swal: any = {
      title,
      text,
      icon,
      timer,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: showCancel,
      confirmButtonColor: '#3085d6',
      confirmButtonText: showCancel ? '¡Si, Confirmar!' : 'Ok',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',

    };
    if (preConfirm) {
      swal = {...swal,
        preConfirm,
        allowOutsideClick : () => !Swal.isLoading(),
        showLoaderOnConfirm: true
        }
    }
    return Swal.fire(swal)
  }

}
