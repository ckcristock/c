import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss']
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  preliquidados:any = [
    {
      name: 'Néstor Eduardo Lima Rojas',
      position: 'Full Stack',
      time: 'Hace 12 Dias',
      id: 1
    },
    {
      name: 'Julio Andres Perez Medina',
      position: 'Frontend',
      time: 'Hace 10 Dias',
      id: 2
    }
  ]
  
  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal.show();
  }

  alert(id){
    Swal.fire({
      icon: 'warning',
      title: '¿Desea incluir los dias trabajados en la liquidación?',
      input: 'select',
      inputOptions: {
        si: 'Si',
        no: 'No'
      },
      showCancelButton: true,
      cancelButtonColor: "#d33", 
      cancelButtonText: "No, Dejame Comprobar", 
      confirmButtonText: 'Liquidar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['rrhh/liquidado/', id]);
      }
    })
  }

}
