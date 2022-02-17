import { Component, OnInit } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { Globales } from '../../../../globales';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalService } from '../../../../../ajustes/informacion-base/services/swal.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mediomagneticoagrupacioncrear',
  templateUrl: './mediomagneticoagrupacioncrear.component.html',
  styleUrls: ['./mediomagneticoagrupacioncrear.component.scss']
})
export class MediomagneticoagrupacioncrearComponent implements OnInit {

  public datosCabecera:any = {
    Titulo: 'Agrupar Medios Magneticos',
    Fecha: new Date(),
  }
  
  public MediosMagModel:any = {
    Codigo_Formato: '',
    Nombre_Formato: ''
  }

  public Formatos:any = [{
    Formato: ''
  }];
  public listaFormatosEspeciales: Array<any>;
  public alertOption: SweetAlertOptions;
  
  constructor(private globales: Globales, private http: HttpClient, private router: Router, private swalService: SwalService, private route: ActivatedRoute) { 
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Guardar este Formato",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarMediosMag();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }

  ngOnInit() {
    this.getListaFormatosEspeciales();

    let id = this.route.snapshot.params.id;

    if (id !== null && id !== undefined) {
      this.getDetallesFormato(id); 
    }
  }

  nuevoFormato(pos) {
    let pos2 = pos+1;

    if (this.Formatos[pos2] == undefined) {
      
      let obj:any = {
        Formato: ''
      };

      this.Formatos.push(obj);
    }
  }

  eliminarFila(pos) {
    this.Formatos.splice(pos,1);
  }

  guardarMediosMag() {
    let info = this.globales.normalize(JSON.stringify(this.MediosMagModel));
    let formatos = this.globales.normalize(JSON.stringify(this.Formatos));

    let datos = new FormData();

    datos.append('datos', info);
    datos.append('formatos', formatos);

   this.http.post(environment.ruta+'php/contabilidad/mediosmagneticos/guardar_agrupacion_especiales.php',datos).subscribe((data:any)=>{
    if (data.tipo == 'success') {
      Swal.fire({
        icon: data.tipo,
        title: data.titulo,
        text: data.mensaje
      });
      // this.swalService.ShowMessage(swal);

      setTimeout(() => {
        this.router.navigate(['/contabilidad/informesdian/agruparmediosmagneticos']);
      }, 300);
    }
   }, error => {
    Swal.fire({
      icon: 'warning',
      text: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
      title: 'Oops!'
    });
    // this.swalService.ShowMessage(swal);
     
   }) 
  }

  getListaFormatosEspeciales() {
    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/formatos_especiales.php').subscribe((data:any) => {
      this.listaFormatosEspeciales = data;
    })
  }

  getDetallesFormato(id) {
    let p = {id: id};

    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/detalles_formatos_agrup.php',{params: p}).subscribe((data:any) => {
      this.MediosMagModel = data.encabezado;
      this.Formatos = data.formatos;

      setTimeout(() => {
        let obj:any = {
          Formato: ''
        };
  
        this.Formatos.push(obj);
      }, 300);
    })
  }

}
