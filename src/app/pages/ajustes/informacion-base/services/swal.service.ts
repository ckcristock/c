import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }
  
  show( { title, text, icon } ){
    return Swal.fire({
        title,
        text,
        icon,
        allowOutsideClick: false,
        allowEscapeKey: false,
      })
  }

}
