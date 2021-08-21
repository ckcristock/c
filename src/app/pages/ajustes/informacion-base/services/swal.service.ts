import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }
  
  show( { title, text, icon , timer =0} ){
    return Swal.fire({
        title,
        text,
        icon,
        timer,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
  }

}
