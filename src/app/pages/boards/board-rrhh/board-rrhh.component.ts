import { Component, OnInit, ViewChild, TemplateRef, ViewEncapsulation, ElementRef, } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
/* import { environment } from 'src/environments/environment';
import { Globales } from '../../shared/globales/globales'; */
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-board-rrhh',
  templateUrl: './board-rrhh.component.html',
  styleUrls: ['./board-rrhh.component.scss']
})
export class BoardRrhhComponent implements OnInit {

  @ViewChild('studentChart') studentChart: ElementRef;
  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  @ViewChild('confirmacionGuardar') confirmacionGuardar: any;
  public llegadasChartTag: CanvasRenderingContext2D;
  public llegadasTardeChartOption: any;

  public llegadasTardeChartData: any;
  public llegadas: any = [];
  public cumpleanos: any = [];
  public Contratos: any = [];
  public ContratosPreliquidados: any = [];
  public ContratosPrueba: any = [];
  public Permisos: any = [];
  public OtroSi: any = [];
  public cumpleanerosDia: any = [];
  public cumpleanerosSiguientes: any = [];
  public dias_mes: any = [];
  public funcionarios_tarde: any = [];
  public feedbackData: any = [];
  public feedbackOption: any = [];
  public graficaData: any = [];
  public options: any = [];
  public estadisticas: any = [];
  public total_llegadas_tarde: any = 0;
  public alertOption: SweetAlertOptions = {};
  public Id_Contrato: any = '';

  public AbrirModalOtrosi:Subject<any> = new Subject();

  public ActividadModel: any = {};
  @ViewChild('ModalCambioEstado') ModalCambioEstado: any;
  mes_actual: string;
  public meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  globales = {ruta: 'https://sigespro.com.co/'}
  constructor(private http: HttpClient, private location: Location, private route: ActivatedRoute) {
    
    this.LlegadasTardeMes();
    this.CumpleanosMes();
    this.CargarGraficaTorta();
    this.CargarContratos();
    this.CargarPreliquidados();
    this.CargarContratosPrueba();
    this.ListarPermisos();
    this.ListarOtroSi();
  }

  ngOnInit() {
    this.MesActual();
    this.LoadChart();
    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a enviar el preaviso a este funcionario ",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Enviar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          this.EnviarPreaviso();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }

  }


  ListarPermisos() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/permisos.php').subscribe((data: any) => {
      this.Permisos = data.Permisos;
    });
  }

  MesActual() {
    let fecha = new Date();
    let mes = fecha.getMonth();
    this.MesToString(mes);
  }

  MesToString(mes: number) {
    this.mes_actual = this.meses[mes];
  }

  LoadChart() {
    setTimeout(() => {
      const llegadas_tag = (((<HTMLCanvasElement>this.studentChart.nativeElement).children));
      this.llegadasChartTag = ((llegadas_tag['llegadas_tarde_chart']).lastChild).getContext('2d');
      const def = (this.llegadasChartTag).createLinearGradient(500, 0, 100, 0);
      def.addColorStop(0, '#2ed8b6');
      def.addColorStop(1, '#7cffe5');
      this.llegadasTardeChartData = {
        labels: this.dias_mes, //Eje X
        datasets: [{
          label: 'Llegadas Tarde',
          borderColor: def,
          pointBorderColor: '#fff',
          pointBackgroundColor: def,
          pointHoverBackgroundColor: def,
          pointHoverBorderColor: def,
          pointBorderWidth: 2,
          pointHoverRadius: 14,
          pointHoverBorderWidth: 1,
          pointRadius: 8,
          fill: false,
          borderWidth: 2,
          data: this.llegadas
          //Eje Y
        }]
      };

    }, 600);
  }

  LlegadasTardeMes() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/llegadas_tarde.php').subscribe((data: any) => {
      this.total_llegadas_tarde = data.Total_llegadas_mensual;

      data.llegadas_count.forEach(llegada => {
        this.llegadas.push(llegada.llegadas_tarde);
        this.dias_mes.push(llegada.dia);
      });

      this.funcionarios_tarde = data.funcionarios_llegadas_tarde;
    });
  }

  CumpleanosMes() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/cumpleanos.php').subscribe((data: any) => {
      this.cumpleanos = data.cumpleaneros;

      this.CumpleanerosDelDia(this.cumpleanos);
    });
  }
  CargarContratos() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/contratos.php').subscribe((data: any) => {
      this.Contratos = data.Contratos;
    });
  }
  CargarContratosPrueba(){
    this.http.get(this.globales.ruta + 'php/recursos_humanos/contratos.php').subscribe((data: any) => {
      // this.Contratos = data.Contratos;
      this.ContratosPrueba = data.ContratosPrueba;

    });
  }
  CargarPreliquidados() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/contratos.php').subscribe((data: any) => {
      this.ContratosPreliquidados = data.ContratosPreliquidados;
    });
  }
  ListarOtroSi(){
    this.http.get(this.globales.ruta + 'php/recursos_humanos/otrosi.php').subscribe((data: any) => {
      this.OtroSi = data;
    });
  }

  CumpleanerosDelDia(listaCumpleaneros: any) {

    listaCumpleaneros.forEach((cumpleanero: any, index: number) => {

      let fecha_cumple = new Date(cumpleanero.Fecha_N);
      let fecha_actual = new Date();

      if (fecha_cumple.getDate() == fecha_actual.getDate()) {
        this.cumpleanerosDia.push(cumpleanero);
      } else {
        this.cumpleanerosSiguientes.push(cumpleanero);
      }
    });

  }

  CargarGraficaTorta() {
    this.http.get(this.globales.ruta + 'php/recursos_humanos/novedades_rrhh.php').subscribe((data: any) => {
      this.graficaData = data.Grafica;

      let Porcentaje = [];
      let Colores = ['#ffbd5d', '#53A3FF', '#FF657F', '#FE978C', '#3DDBBB', '#CD82AD', '#CC4748'];
      let ColoresGrafica = [];
      let LabelsGrafica = [];

      this.graficaData.Tipos_Novedades.forEach((dato, i) => {

        ColoresGrafica.push(Colores[i]);
        LabelsGrafica.push(dato.Tipo_Novedad);

      });

      this.graficaData.Porcentajes.forEach((dato, i) => {

        if (dato > 0) {
          Porcentaje.push(dato);
          let atributos = {
            nombre: LabelsGrafica[i],
            porcentaje: dato,
            color: Colores[i]
          };

          this.estadisticas.push(atributos);
        }



      });

      setTimeout(() => {
        this.options = {
          position: ['bottom', 'right'],
          maxStack: 8,
          timeOut: 1500,
          showProgressBar: true,
          pauseOnHover: true,
          lastOnBottom: true,
          clickToClose: true,
          preventDuplicates: false,
          preventLastDuplicates: false,
          theClass: 'bg-c-pink no-icon',
          rtl: false,
          animate: 'rotate'
        };

        this.feedbackData = {
          datasets: [{
            data: Porcentaje, // aqui son los valores de la gráfica
            backgroundColor: ColoresGrafica, // aquí los colores de la gráfica
            label: 'Dataset 1',
            borderWidth: 0
          }], labels: LabelsGrafica
        };

        this.feedbackOption = {
          responsive: true,
          legend: { display: false },
          title: { display: false },
          animation: { animateScale: true, animateRotate: true }
        };
      }, 1000);
    });
  }

  ConvertirFechas() {
    if (this.cumpleanos.length > 0) {
      this.cumpleanos.forEach(cumple => {
        cumple = this.ConvertToStringDate(cumple);
      });
    }
  }
  ConvertToStringDate (date:string){
    let splittedDate = date.split("-");
    let returnedValue = splittedDate[1]+" de "+this.meses[parseInt(splittedDate[0]) - 1];
    return returnedValue;
  }

  MostrarPermiso(pos) {
    this.ActividadModel = this.Permisos[pos];
    this.ModalCambioEstado.show();

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

  CambiarEstadoActividad() {
    this.ActividadModel.Funcionario_Aprueba = (JSON.parse(localStorage.getItem("User"))).Identificacion_Funcionario;
    let info = this.normalize(JSON.stringify(this.ActividadModel));
    let datos = new FormData();
    datos.append("datos", info);
    this.http.post(this.globales.ruta + 'php/recursos_humanos/guardar_permiso.php', datos).subscribe((data: any) => {
      this.confirmacionSalir.title = 'Operacion Exitosa';
      this.confirmacionSalir.text = data.mensaje;
      this.confirmacionSalir.type = data.tipo;
      this.confirmacionSalir.show();
      this.ModalCambioEstado.hide();
      this.ActividadModel = {}
      this.ListarPermisos();
    });
  }

  CapturarDatos(idcontrato) {
    this.Id_Contrato = idcontrato;
    this.confirmacionGuardar.show();
  }

  EnviarPreaviso() {
    if (this.Id_Contrato != '' && this.Id_Contrato != undefined) {
      let datos = new FormData();
      datos.append("datos", this.Id_Contrato);
      this.http.post(this.globales.ruta + 'php/recursos_humanos/enviar_preaviso.php', datos).subscribe((data: any) => {
        this.confirmacionSalir.title = 'Operacion Exitosa';
        this.confirmacionSalir.text = data.mensaje;
        this.confirmacionSalir.type = data.tipo;
        this.confirmacionSalir.show();

      });
    }

  }

  AbrirModal(data:any){
    this.AbrirModalOtrosi.next(data);
  }
}
