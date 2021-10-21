import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { LiquidadosService } from './liquidados.service';

@Component({
  selector: 'app-liquidados',
  templateUrl: './liquidados.component.html',
  styleUrls: ['./liquidados.component.scss']
})
export class LiquidadosComponent implements OnInit {
  id:any;
  liquidado:any = {
    first_name: '',
    second_name: '',
    first_surname: '',
    second_surname: ''
  };
  constructor( 
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private liquidadosService:LiquidadosService
              ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getLiquidado();
  }

  getLiquidado() {
    this.liquidadosService.getLiquidado(this.id)
    .subscribe( (res:any) => {
      this.liquidado = res.data
    })
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
        this.router.navigate(['/rrhh/liquidados']);
      }
    })
  }

}
