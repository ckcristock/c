import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwalService {
  constructor() {}

  show({ title, text, icon, timer = 0, showCancel = true }) {
    return Swal.fire({
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
    });
  }
}
