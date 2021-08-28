import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liquidados',
  templateUrl: './liquidados.component.html',
  styleUrls: ['./liquidados.component.scss']
})
export class LiquidadosComponent implements OnInit {

  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  cancelButton() {
    Swal.fire({
      icon: 'warning',
      title: '¿Estas seguro?',
      text: 'Se cancelará la liquidación.',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, Cancelar!',
      cancelButtonText: 'No, dejame comprobar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/rrhh/preliquidados']);
      }
    })
  }

}
