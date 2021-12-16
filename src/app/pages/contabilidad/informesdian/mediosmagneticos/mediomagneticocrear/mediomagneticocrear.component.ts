import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { MedioMagneticoModel } from './MedioMagneticoModel';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MediosmagnticosService } from '../mediosmagnticos.service';
import { Globales } from '../../../globales';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mediomagneticocrear',
  templateUrl: './mediomagneticocrear.component.html',
  styleUrls: ['./mediomagneticocrear.component.scss']
})
export class MediomagneticocrearComponent implements OnInit {

  @ViewChild('FormMediosMag') FormMediosMag:any;
  
  public datosCabecera:any = {
    Titulo: 'Medios Magneticos',
    Fecha: new Date(),
  }

  public Cuenta:any = [];
  public Cuentas_Contables:any = [{
    Cuenta: '',
    Id_Plan_Cuenta: '',
    Concepto: ''
  }];
  public listaTiposDocumentos: Array<any>;
  public Tipos_Documentos:any = [{
    Tipo: ''
  }];

  public alertOption: SweetAlertOptions;

  public url:string = this.router.url;
  public formatoEspecial:boolean = false;

  public MediosMagModel: MedioMagneticoModel = new MedioMagneticoModel();
  enviromen:any;

  constructor(
              private globales: Globales,
              private http: HttpClient, 
              private swalService: SwalService, 
              private router: Router, 
              private route: ActivatedRoute, 
              private _medios: MediosmagnticosService
              ) { 
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a Guardar este Formato",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.guardarMediosMag();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }

    this.formatoEspecial = this.isFormatoEspecial();
  }

  search1 = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term.length < 4 ? []
        : this.Cuenta.filter(v => v.Codigo.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 100))
    );
    formatter1 = (x: { Codigo: string }) => x.Codigo;

  ngOnInit() {
    this.enviromen = environment;
    this.listaCuentas();
    this.tiposDocumentos();

    let id = this.route.snapshot.params.id;
    
    if (id !== null && id !== undefined) {
      this.getDetallesMedioMag(id);
    }
  }

  listaCuentas() {
    this.http.get(environment.ruta + 'php/comprobantes/lista_cuentas.php')
    .subscribe((data:any) => {
      this.Cuenta = data.Activo;
    })
  }

  validarCampo(campo, event, tipo) { // Funcion que validará los campos de typeahead
    this._medios.validarCampoTypeAHead(campo, event, tipo);
  }

  BuscarCuenta(model, pos) {
    if (typeof(model) == 'object') {
      let pos2 = pos+1;
      this.Cuentas_Contables[pos].Id_Plan_Cuenta = model.Id_Plan_Cuentas;

      if (this.Cuentas_Contables[pos2] == undefined) {
        let obj:any = {
          Cuenta: '',
          Id_Plan_Cuenta: '',
          Concepto: ''
        };

        this.Cuentas_Contables.push(obj);
      }
    }
  }

  tiposDocumentos(tipo?) {
    let p:any = tipo != null && tipo != undefined ? {Tipo: 'Normal'} : {};
    this.http.get(environment.ruta+'php/contabilidad/tipos_documentos.php',{params: p})
    .subscribe((data:any) => {
      this.listaTiposDocumentos = data;
    })
  }

  nuevoTipoDocumento(pos) {
    let pos2 = pos+1;

    if (this.Tipos_Documentos[pos2] == undefined) {
      
      let obj:any = {
        Tipo: ''
      };

      this.Tipos_Documentos.push(obj);
    }
  }

  eliminarFila(tipo, pos) {
    if (tipo == 'Cuentas') {
      this.Cuentas_Contables.splice(pos,1);
    } else if(tipo == 'Tipos') {
      this.Tipos_Documentos.splice(pos,1);
    }
  }

  campoPeriodo(event) {
    let regex = /([0-9]{4})+/g
    let string = event.target.value;

    if (string != '') {
      if (regex.test(string) && parseInt(string) >= 2019) {
        return true;
      } else {
        (document.getElementById('periodo') as HTMLInputElement).value = '';
        (document.getElementById('periodo') as HTMLInputElement).focus();
        let swal = {
          codigo: 'error',
          titulo: 'Oops!',
          mensaje: `El periodo no es valido.`
        };
        this.swalService.ShowMessage(swal);
      }
    }
  }

  guardarMediosMag() {
    let info = this.globales.normalize(JSON.stringify(this.MediosMagModel));
    let detalles = this.globales.normalize(JSON.stringify(this.Cuentas_Contables));
    let tipos_documentos = this.globales.normalize(JSON.stringify(this.Tipos_Documentos));

    let datos = new FormData();

    datos.append('datos', info);
    datos.append('cuentas', detalles);
    datos.append('tipos_documentos', tipos_documentos);

   this.http.post(environment.ruta+'php/contabilidad/mediosmagneticos/guardar_mediomagnetico.php',datos).subscribe((data:any)=>{
    if (data.tipo == 'success') {
      let swal = {
        codigo: data.tipo,
        titulo: data.titulo,
        mensaje: data.mensaje
      };
      this.swalService.ShowMessage(swal);

      setTimeout(() => {
        if (this.formatoEspecial) {
          this.router.navigate(['/informesdian/mediosmagneticosespeciales']);
        } else {
          this.router.navigate(['/informesdian/mediosmagneticos']);
        }
        
      }, 300);
    }
   }, error => {
    let swal = {
      codigo: 'warning',
      mensaje: 'Se perdió la conexión a internet. Por favor vuelve a intentarlo',
      titulo: 'Oops!'
    };
    this.swalService.ShowMessage(swal);
     
   }) 
  }

  getDetallesMedioMag(id) {
    let p = {id: id};

    this.http.get(environment.ruta+'php/contabilidad/mediosmagneticos/detalles.php',{params: p}).subscribe((data:any) => {
      this.MediosMagModel = data.encabezado;
      this.Cuentas_Contables = JSON.parse(data.cuentas);
      this.Tipos_Documentos = JSON.parse(data.tipos);
    });
  }

  isFormatoEspecial():boolean {
    let str = this.url.indexOf('especiales');

    if (str >= 0) {
      this.MediosMagModel.Tipo_Medio_Magnetico = 'Especial';
      return true;
    }

    return false;
  }

}
