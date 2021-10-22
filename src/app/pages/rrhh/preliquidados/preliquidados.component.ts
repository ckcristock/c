import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreliquidadosService } from './preliquidados.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss']
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  preliquidados:any = []
  loading:boolean = false;
  diffDays:any;
  constructor( 
                private router: Router,
                private _preliquidadosService:PreliquidadosService,
                private _swal: SwalService
              ) { }

  ngOnInit(): void {
    this.getPreliquidados();
  }
  
  openModal() {
    this.modal.show();
  }
  
  getPreliquidados() {
    this.loading = true;
    this._preliquidadosService.getPreliquidados()
    .subscribe( (res:any) => {
      this.preliquidados = res.data;
      this.loading = false;
      /* for (const data of this.preliquidados) {
        let now = moment().format('MM-DD-YYYY');
        let updated_at = moment(data.updated_at).format('MM-DD-YYYY');
        this.diffDays = moment(now).diff(updated_at, 'days');
        console.log(this.diffDays);
      } */
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

  activate(id){
    this._preliquidadosService.activate({status : 'Activo'}, id).subscribe((r:any) => {
      this._swal.show({
        icon: 'question',
        title: '¿Estas Seguro?',
        text: 'Se dispone a Activar el empleado'
      }).then((result) => {
        if (result.isConfirmed) {
          this.getPreliquidados();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactorio',
            text: 'El Funcionario ha sido activado con éxito.',
            showCancel: false
          });
        }
      });
    });
  }

}
