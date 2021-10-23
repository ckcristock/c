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
      console.log(this.preliquidados);
      this.loading = false;
      for (let index = 0; index < this.preliquidados.length; index++) {
        let fecha  = this.preliquidados[index].updated_at;
        let InfoH  = this.cantidadDate(fecha);
        this.preliquidados[index].updated_at = InfoH;
      }
    })
  }

  cantidadDate(fecha){
    let now    = moment(fecha).startOf('D').fromNow();
    let hoy    = new Date();
    let fecha1 = moment(hoy, "YYYY-MM-DD HH:mm:ss");
    let fecha2 = moment(fecha, "YYYY-MM-DD HH:mm:ss");
    let horas  = Math.abs(fecha2.diff(fecha1, 'h')); 
    let tiempo = '';
    if(horas > 24){
      let dias   = horas/24
          dias   = Math.trunc(dias);
          tiempo = 'Hace ' + dias + ' Dias';     
      if(dias > 30){
        let meses  = dias/30;
            meses  = Math.trunc(meses);
            tiempo = 'Hace ' + meses + ' Meses';
        if(meses > 12){
          let años   = meses/12;
              años   = Math.trunc(años);
              tiempo = 'Hace ' + años + ' Años';     
        }    
      }                       
    } else if ( horas == 0 ) {
          tiempo = 'Hace un momento ';            
    } else {
          tiempo = 'Hace ' + horas + ' Horas';            
    }
    return  {
      'tiempo' : tiempo,
      'horas'  : horas 
    };
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
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: 'Se dispone a Activar el empleado'
    }).then((result) => {
      if (result.isConfirmed) {
        this._preliquidadosService.activate({status : 'Activo'}, id).subscribe((r:any) => {
          this.getPreliquidados();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactorio',
            text: 'El Funcionario ha sido activado con éxito.',
            showCancel: false
          });
        });
      }
    });
  }

}
