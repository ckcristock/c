import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/worldLow.js';
import '../../../../assets/charts/amchart/continentsLow.js';
/* import  '../../../../' */
import { Location } from "@angular/common";

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { IMyDrpOptions } from 'mydaterangepicker';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alistamiento',
  templateUrl: './alistamiento.component.html',
  styleUrls: ['./alistamiento.component.scss']
})
export class AlistamientoComponent implements OnInit {

  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('PlantillaTipo') PlantillaTipo: TemplateRef<any>;
  @ViewChild('confirmacionSwal') confirmacionSwal: SwalComponent;
  @ViewChild('modalGuiaRemision') modalGuiaRemision: any;
  @ViewChild('modalGuiaRemisionEditar') modalGuiaRemisionEditar: any;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  @ViewChild('FormGuiaRemision') FormGuiaRemision: NgForm;
  public alertOption:SweetAlertOptions = {};
  @ViewChild('confirmacionGuardar') private confirmacionGuardar: SwalComponent;

  FaseI: any[] = [];
  FaseII: any[] = [];
  public user: any;
  public Id_Remision: any;
  Alistamientos: any = [];
  public maxSize = 5;
  public TotalItems: number;
  public page = 1;
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '180px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  public Editar={
    Id_Remision:'',
    Numero_Guia:'',
    Empresa_Envio:'',
    Tipo:'Creacion',
    Tipo_Rem:'Creacion',
    Identificacion_Funcionario: '1'
  }
  public filtro_cod:string = '';
  public filtro_tipo:string = '';
  public filtro_origen:string = '';
  public filtro_destino:string = '';
  public filtro_est:string = '';
  public filtro_fecha:any = '';
  public filtro_fases:any = '';

  public filtro_Origen1:string = '';
  public filtro_Destino1:string = '';
  public filtro_Codigo1:string = '';

  public filtro_Origen2:string = '';
  public filtro_Destino2:string = '';
  public filtro_Codigo2:string = '';
  public ElementosFaseI:any;
  public ElementosFaseII:any;
  public Alistadas:any;


  public ValidaFase1 = false;
  public ValidaFase2 = false;
  alive: any;
  envi :any = {ruta:''}

  constructor(private http: HttpClient,  private location: Location, private route: ActivatedRoute, private router: Router) {
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a guardar los datos de envio de la Remision",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarGuiaRemision();
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }
    this.ListarAlistamientos();
  }

  ngOnInit() {
    this.envi = environment
    /* TODO auth user */
    this.user = {
      Identificacion_Funcionario : '1'
    };
    this.http.get(environment.ruta + 'php/alistamiento_nuevo/detalle_fase1.php',{params:{funcionario:this.user.Identificacion_Funcionario}}).subscribe((data: any) => {
      this.FaseI = data;
      this.ValidaFase1 = true;
    });
    this.http.get(environment.ruta + 'php/alistamiento_nuevo/detalle_fase2.php',{params:{funcionario:this.user.Identificacion_Funcionario}}).subscribe((data: any) => {
      this.FaseII = data;
      this.ValidaFase2 = true;
    });
    let params = this.route.snapshot.queryParams;
    if (Object.keys(params).length > 0) {
        this.filtro_Origen1 = params.origen1 ? params.origen1 : '';
        this.filtro_Destino1 = params.destino1 ? params.destino1 : '';
        this.filtro_Codigo1 = params.codigo1 ? params.codigo1 : '';

        this.filtro_Origen2 = params.origen2 ? params.origen2 : '';
        this.filtro_Destino2 = params.destino2 ? params.destino2 : '';
        this.filtro_Codigo2 = params.codigo2 ? params.codigo2 : '';
    }

    this.ElementosFaseI=setInterval(() => {
      let queryString = '';

      if(this.filtro_Origen1!=''||this.filtro_Destino1!=''||this.filtro_Codigo1!=''){
        queryString = '&origen1=' + this.filtro_Origen1+"&destino1="+this.filtro_Destino1+"&codigo1="+this.filtro_Codigo1;
      }
      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase1.php?funcionario='+this.user.Identificacion_Funcionario+queryString).subscribe((data:any)=>{
        this.FaseI = data;
      });
    },60000);

    this.ElementosFaseII= setInterval(() => {
      let queryString2 = '';

        if(this.filtro_Origen2!=''||this.filtro_Destino2!=''||this.filtro_Codigo2!=''){
          queryString2 = '&origen2=' + this.filtro_Origen2+"&destino2="+this.filtro_Destino2+"&codigo2="+this.filtro_Codigo2;
        }
      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase2.php?funcionario='+this.user.Identificacion_Funcionario+queryString2).subscribe((data:any)=>{
        this.FaseII = data;
      });
    },10000);
    this.Alistadas= setInterval(() => {
      let params:any = {};

      if (this.filtro_fecha != "" || this.filtro_cod != "" || this.filtro_tipo != "" || this.filtro_origen != "" || this.filtro_destino != "" || this.filtro_est != "" || this.filtro_fases != "") {

        params.pag = this.page;

        if (this.filtro_fecha != "" && this.filtro_fecha != null) {
          params.fecha = this.filtro_fecha.formatted;
        }
        if (this.filtro_cod != "") {
          params.cod = this.filtro_cod;
        }
        if (this.filtro_tipo != "") {
          params.tipo = this.filtro_tipo;
        }
        if (this.filtro_origen != "") {
          params.origen = this.filtro_origen;
        }
        if (this.filtro_destino != "") {
          params.destino = this.filtro_destino;
        }
        if (this.filtro_fases != "" && this.filtro_fases == 1) {
          params.fases = 1;
          this.filtro_est = "Pendiente";
        } else if (this.filtro_fases != "" && this.filtro_fases == 2) {
          params.fases = 2;
          this.filtro_est = "";
        }
        if (this.filtro_est != "") {
          params.est = this.filtro_est;
        }

        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php?'+queryString).subscribe((data: any) => {
          this.Alistamientos = data.remisiones;
          this.TotalItems = data.numReg;
        });
      } else {
        this.filtro_fecha = '';
        this.filtro_cod = '';
        this.filtro_tipo = '';
        this.filtro_origen = '';
        this.filtro_destino = '';
        this.filtro_est = '';
        this.filtro_fases = '';

        this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php?pag='+this.page).subscribe((data: any) => {
          this.Alistamientos = data.remisiones;
          this.TotalItems = data.numReg;
        });
      }
    },10000);
  }
  ngOnDestroy() {
    clearInterval(this.ElementosFaseI);
    clearInterval(this.ElementosFaseII);
    clearInterval(this.Alistadas);
  }
  showAlert(evt:any){
        this.confirmacionGuardar.fire();
  }
  save(){
    // console.log("data saved");
  }
  ListarAlistamientos() {

    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_fecha = params.fecha ? params.fecha : '';
      this.filtro_cod = params.cod ? params.cod : '';
      this.filtro_origen = params.origen ? params.origen : '';
      this.filtro_destino = params.destino ? params.destino : '';
      this.filtro_est = params.est ? params.est : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';
      this.filtro_fases = params.fases ? params.fases : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }

    this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php'+queryString).subscribe((data: any) => {
      console.log("remisiones");
      console.log(data);

      this.Alistamientos = data.remisiones;
      this.TotalItems = data.numReg;
    });
  }

  paginacion() {

    let params:any = {
      pag: this.page
    }

    if (this.filtro_fecha != "" && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
    }
    if (this.filtro_cod != "") {
      params.cod = this.filtro_cod;
    }
    if (this.filtro_tipo != "") {
      params.tipo = this.filtro_tipo;
    }
    if (this.filtro_origen != "") {
      params.origen = this.filtro_origen;
    }
    if (this.filtro_destino != "") {
      params.destino = this.filtro_destino;
    }
    if (this.filtro_est != "") {
      params.est = this.filtro_est;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/alistamientosnuevo', queryString);

    this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php?'+queryString).subscribe((data: any) => {
      this.Alistamientos = data.remisiones;
      this.TotalItems = data.numReg;
    });
  }

  dateRangeChanged(event) {

    if (event.formatted != "") {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = '';
    }

    this.filtros();
  }

  filtros() {

    let params:any = {};

    if (this.filtro_fecha != "" || this.filtro_cod != "" || this.filtro_tipo != "" || this.filtro_origen != "" || this.filtro_destino != "" || this.filtro_est != "" || this.filtro_fases != "") {
      this.page = 1;
      params.pag = this.page;

      if (this.filtro_fecha != "" && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.filtro_cod != "") {
        params.cod = this.filtro_cod;
      }
      if (this.filtro_tipo != "") {
        params.tipo = this.filtro_tipo;
      }
      if (this.filtro_origen != "") {
        params.origen = this.filtro_origen;
      }
      if (this.filtro_destino != "") {
        params.destino = this.filtro_destino;
      }
      if (this.filtro_fases != "" && this.filtro_fases == 1) {
        params.fases = 1;
        this.filtro_est = "Pendiente";
      } else if (this.filtro_fases != "" && this.filtro_fases == 2) {
        params.fases = 2;
        this.filtro_est = "";
      }
      if (this.filtro_est != "") {
        params.est = this.filtro_est;
      }

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/alistamientosnuevo', queryString);

      this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php?'+queryString).subscribe((data: any) => {
        this.Alistamientos = data.remisiones;
        this.TotalItems = data.numReg;
      });
    } else {
      this.location.replaceState('/alistamientosnuevo', '');

      this.filtro_fecha = '';
      this.filtro_cod = '';
      this.filtro_tipo = '';
      this.filtro_origen = '';
      this.filtro_destino = '';
      this.filtro_est = '';
      this.filtro_fases = '';

      this.http.get(environment.ruta + 'php/alistamiento/detalle_alistamiento.php').subscribe((data: any) => {
        this.Alistamientos = data.remisiones;
        this.TotalItems = data.numReg;
      });
    }
  }

  filtrosFase1() {

    let params:any = {};

    if (this.filtro_Codigo1 != "" || this.filtro_Origen1 != "" || this.filtro_Destino1 != "") {

      if (this.filtro_Codigo1 != "") {
        params.codigo1 = this.filtro_Codigo1;
      }
      if (this.filtro_Origen1 != "") {
        params.origen1= this.filtro_Origen1;
      }
      if (this.filtro_Destino1 != "") {
        params.destino1 = this.filtro_Destino1;
      }

      let queryString = 'origen1='+this.filtro_Origen1+'&destino1='+this.filtro_Destino1+'&codigo1='+this.filtro_Codigo1;

      this.location.replaceState('/alistamientosnuevo', queryString);

      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase1.php?funcionario='+this.user.Identificacion_Funcionario+'&'+queryString).subscribe((data:any)=>{
        this.FaseI = data;
      })
    } else {
      this.location.replaceState('/alistamientosnuevo', '');

      this.filtro_Codigo1 = '';
      this.filtro_Origen1 = '';
      this.filtro_Destino1 = '';

      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase1.php?funcionario='+this.user.Identificacion_Funcionario).subscribe((data:any)=>{
        this.FaseI = data;
      });
    }
  }
  filtrosFase2() {

    let params:any = {};

    if (this.filtro_Codigo2 != "" || this.filtro_Origen2 != "" || this.filtro_Destino2 != "") {

      if (this.filtro_Codigo2 != "") {
        params.codigo2 = this.filtro_Codigo2;
      }
      if (this.filtro_Origen2 != "") {
        params.origen2= this.filtro_Origen2;
      }
      if (this.filtro_Destino2 != "") {
        params.destno2 = this.filtro_Destino2;
      }

      let queryString = '&origen2='+this.filtro_Origen2+'&destino2='+this.filtro_Destino2+'&codigo2='+this.filtro_Codigo2;

      this.location.replaceState('/alistamientosnuevo', queryString);

      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase2.php?funcionario='+this.user.Identificacion_Funcionario+queryString).subscribe((data:any)=>{


        this.FaseII = data;
      })
    } else {
      this.location.replaceState('/alistamientosnuevo', '');

      this.filtro_Codigo2 = '';
      this.filtro_Origen2 = '';
      this.filtro_Destino2 = '';

      this.http.get(environment.ruta+'php/alistamiento_nuevo/detalle_fase2.php?funcionario='+this.user.Identificacion_Funcionario).subscribe((data:any)=>{

        this.FaseII = data;
      });
    }
  }

  Bandera_Fase1(id,tipo,idc){
    let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision';
    this.http.get(environment.ruta + 'php/alistamiento/guardar_hora_inicio.php',
            { params: { id: id, mod, funcionario:this.user.Identificacion_Funcionario, tipo:"Fase1", idc:idc } }).subscribe((data: any) => {
      this.router.navigate(['/inventario/alistamiento/crear',id,tipo,idc]);
    });


  }
  Bandera_Fase2(id,tipo,idc){
    let mod = tipo == 'Devolucion' ? 'Devolucion_Compra' : 'Remision'
    this.http.get(environment.ruta + 'php/alistamiento/guardar_hora_inicio.php',
              { params: { id , mod, funcionario:this.user.Identificacion_Funcionario, tipo:"Fase2", idc:idc } }).subscribe((data: any) => {
      this.router.navigate(['/inventario/alistamiento/crear',id,tipo,idc]);
    });


  }
  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇçÂ®Ã\n",
      to =     "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuuNnccARA ",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  GuardarGuiaRemision() {
    let info = this.normalize(JSON.stringify(this.Editar));
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(environment.ruta + 'php/alistamiento/guardar_guia_remisiond.php', datos).subscribe((data: any) => {
      this.modalGuiaRemisionEditar.hide();
      this.confirmacionSwal.title = "Operación Exitosa";
      this.confirmacionSwal.text = "Se han Guardado los datos de la guia de la remisión exitosamente";
      this.confirmacionSwal.icon = "success";
      this.confirmacionSwal.fire();
      this.Editar={
        Id_Remision:'',
        Numero_Guia:'',
        Empresa_Envio:'',
        Tipo:'Creacion',
        Tipo_Rem:'',
        Identificacion_Funcionario: (JSON.parse(localStorage.getItem("User"))).Identificacion_Funcionario
      }
      this.ListarAlistamientos();

    });
  }
  CapturarId(id,tipo) {
    this.Editar.Id_Remision=id;
    this.Editar.Tipo_Rem = tipo;
    this.modalGuiaRemisionEditar.show();
    this.Editar.Empresa_Envio='';
    this.Editar.Numero_Guia=''
  }
  EditarGuia(id, pos, tipo){
    this.Editar.Id_Remision=id;
    this.Editar.Empresa_Envio=this.Alistamientos[pos].Empresa_Envio;
    this.Editar.Numero_Guia=this.Alistamientos[pos].Guia;
    this.Editar.Tipo="Edicion";
    this.Editar.Tipo_Rem=tipo;
    this.modalGuiaRemisionEditar.show();
  }

}
