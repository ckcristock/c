import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { Globales } from '../../../globales';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mediomagagrupadosesp',
  templateUrl: './mediomagagrupadosesp.component.html',
  styleUrls: ['./mediomagagrupadosesp.component.scss']
})
export class MediomagagrupadosespComponent implements OnInit {

  public listaMediosMag:any = [];
  public alertOption: SweetAlertOptions;
  public IdMedioMag:string = '';
  enviromen:any;

  constructor(public globales: Globales, private http: HttpClient, private swalService: SwalService) { 
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
  }

  ngOnInit() {
    this.listaFormatosAgrupados();
    this.enviromen = environment
  }

  listaFormatosAgrupados() {
    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/lista_medios_magneticos_agrupados.php').subscribe((data:any) => {
      this.listaMediosMag = data;
    })
  }

  eliminarMedioMag() {
    let p = {id: this.IdMedioMag};

    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/eliminar_mediomagnetico_agrupados.php', {params: p}).subscribe((data:any)=> {
      Swal.fire({
        icon: data.tipo,
        title: data.titulo,
        text: data.mensaje
      });
      // this.swalService.ShowMessage(swal);
      this.listaFormatosAgrupados();
    }, error => {
      Swal.fire({
        icon: 'warning',
        text: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
        title: 'Oops!'
      });
      // this.swalService.ShowMessage(swal);
    })
  }

}
