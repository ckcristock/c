import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mediosmagneticos',
  templateUrl: './mediosmagneticos.component.html',
  styleUrls: ['./mediosmagneticos.component.scss']
})
export class MediosmagneticosComponent implements OnInit {

  public listaMediosMag:any = [];
  public alertOption: SweetAlertOptions;
  public IdMedioMag = '';
  public url:string = this.router.url;
  public formatoEspecial:boolean = false;
  enviromen:any;

  constructor(private http: HttpClient, private swalService: SwalService, private router: Router) { 
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Eliminar este Formato",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.eliminarMedioMag();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }

    this.formatoEspecial = this.isFormatoEspecial();
  }

  ngOnInit() {
    this.getListaMediosMag();
    this.enviromen = environment
  }

  getListaMediosMag() {
    let p:any = {};

    if (this.formatoEspecial) {
      p.Tipo = 'Especial';
    }

    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/lista_medios_magneticos.php',{params: p}).subscribe((data:any)=> {
      this.listaMediosMag = data;
    })
  }

  eliminarMedioMag() {
    let p = {id: this.IdMedioMag};

    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/eliminar_mediomagnetico.php', {params: p}).subscribe((data:any)=> {
      Swal.fire({
        icon: data.tipo,
        title: data.titulo,
        text: data.mensaje
      });
      // this.swalService.ShowMessage(swal);

      this.getListaMediosMag();
    }, error => {
      Swal.fire({
        icon: 'warning',
        title: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
        text: 'Oops!'
      });
      // this.swalService.ShowMessage(swal);
    })
  }

  isFormatoEspecial():boolean {
    let str = this.url.indexOf('especiales');

    if (str >= 0) {
      return true;
    }

    return false;
  }

}
