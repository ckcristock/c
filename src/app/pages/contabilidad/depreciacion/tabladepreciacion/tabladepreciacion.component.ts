import { Component, OnInit, ViewChild } from '@angular/core';
import swal,  {SweetAlertOptions}  from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-tabladepreciacion',
  templateUrl: './tabladepreciacion.component.html',
  styleUrls: ['./tabladepreciacion.component.scss']
})
export class TabladepreciacionComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal: SwalComponent;
  enviromen:any = {}
  public DepreciacionModel:any = {
    Mes: '',
    Inicio:'',
    Fin:'',
    Tipo: 'PCGA',
    Identificacion_Funcionario: '1'
    // Identificacion_Funcionario: JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario
  };
  public alertOption:SweetAlertOptions = {};
  public queryParams:string = '';
  public Fecha:any = new Date();
  public Depreciacion:Array<any> = [];
  public Cargando:boolean = false;
  public Meses:Array<string> = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  public Years:Array<string> = [];

  public mesActual:number = this.getMesActual();
  //public yearActual:number = this.getYearActual();

  constructor(private http:HttpClient) {
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a generar la depreciacion",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.GuardarDepreciacion();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }
  
  ngOnInit() {
    this.enviromen = environment;
    let year_ini = 2018;
    let year_fin = this.Fecha.getFullYear();
    for(let i=year_ini; i<=year_fin;i++){
      this.Years.push(i.toString());
    }
  }

  GuardarDepreciacion() {
    let info = JSON.stringify(this.DepreciacionModel);
    let datos = new FormData();
    datos.append('datos', info);
    this.http.post(environment.ruta+'php/depreciacion/guardar_depreciacion.php', datos).subscribe((data:any) => {
      if (data.tipo == 'success') {

          window.open(environment.ruta + 'php/contabilidad/movimientoscontables/movimientos_depreciacion_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.DepreciacionModel.Identificacion_Funcionario,'_blank');

          window.open(environment.ruta + 'php/contabilidad/movimientoscontables/movimientos_depreciacion_pdf.php?id_registro='+data.Id+'&id_funcionario_elabora='+this.DepreciacionModel.Identificacion_Funcionario+'&tipo_valor=Niif','_blank');
        
          swal.fire({
            icon: data.tipo,
            title: data.titulo,
            text: data.mensaje
          })
        // this.ShowSwal(data.tipo, data.titulo, data.mensaje);
      } else {
        swal.fire({
          icon: data.tipo,
          title: data.titulo,
          text: data.mensaje
        })
        // this.ShowSwal(data.tipo, data.titulo, data.mensaje);
      }
    }, error => {
      console.log(error);
      
      /* let response = {
        tipo: 'error',
        mensaje: 'Ha ocurrido un error en la conexión. Por favor vuelve a intentarlo',
        titulo: 'Oops!'
      }; */
      swal.fire({
        title: 'Oops!',
        icon: 'error',
        text: 'Ha ocurrido un error en la conexión. Por favor vuelve a intentarlo',

      })
      // this.ShowSwal(response.tipo, response.titulo, response.mensaje);
    })
  }

  setQueryParams() {

    let params:any = {};

    /*
    Original
    if (this.DepreciacionModel.Mes != '') {
      params.Mes = this.DepreciacionModel.Mes;

      if (this.DepreciacionModel.Tipo != '') {
        params.Tipo = this.DepreciacionModel.Tipo;
      }

    }
    */

    if (this.DepreciacionModel.Mes != '' && this.DepreciacionModel.Year != '') {
      params.Mes = this.DepreciacionModel.Mes;
      params.Year = this.DepreciacionModel.Year;

      if (this.DepreciacionModel.Tipo != '') {
        params.Tipo = this.DepreciacionModel.Tipo;
      }

    }

    this.queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');

  }

  ShowSwal(tipo, titulo:string, msg:string){
    this.alertSwal.icon = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.fire();
  }

  getMesActual():number {
    let fecha = new Date();
    let mes = fecha.getMonth().toString();

    if(mes=='0'){
      mes='12';
    }

    return parseInt(mes);
  }
  /*
  getYearActual():number {

    let fecha = new Date();
    let year = fecha.getFullYear().toString();
    console.log('Año Actual: ',year);
    return parseInt(year);
  }
  */

}
