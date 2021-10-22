import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreliquidadosService } from './preliquidados.service';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss']
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  preliquidados:any = []
  
  constructor( private router: Router, private _preliquidadosService:PreliquidadosService ) { }

  ngOnInit(): void {
    this.getPreliquidados();
  }

  openModal() {
    this.modal.show();
  }

  getPreliquidados() {
    this._preliquidadosService.getPreliquidados()
    .subscribe( (res:any) => {
      this.preliquidados = res.data;
      console.log(this.preliquidados);
      
    })
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
